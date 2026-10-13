import {
  DestroyRef,
  InjectionToken,
  Service,
  computed,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { Vibration } from '@ng-native/device';
import { Storage } from '@ng-native/expo/async-storage';
import { audioPlayer } from '@ng-native/expo/audio';
import { Notifications, TriggerType } from '@ng-native/expo/notifications';
import { ongoingNotification } from '@ng-native/expo/ongoing-notification';

/** La hora actual en milisegundos. Un token para que los tests controlen el reloj. */
export const RELOJ = new InjectionToken<() => number>('RELOJ', {
  factory: () => Date.now,
});

/** El sonido de la alarma dentro de la app. Un token porque en los tests no hay audio nativo. */
export interface Sonido {
  sonar(): void;
  parar(): void;
}

export const SONIDO = new InjectionToken<Sonido>('SONIDO', {
  factory: () => {
    const player = audioPlayer(require('../../../assets/sonidos/alarma.wav'));
    return {
      sonar: () => {
        player.native.loop = true;
        void player.native.seekTo(0);
        player.native.play();
      },
      parar: () => player.native.pause(),
    };
  },
});

/** Lo que se guarda en el móvil, para recuperar la cuenta atrás si la app se cierra. */
interface Guardado {
  /** Cuándo termina, en milisegundos desde 1970. */
  readonly fin: number;
  readonly titulo: string;
  readonly detalle: string;
  /** La notificación programada para ese momento. */
  readonly avisoId: string | null;
}

export type Fase = 'parado' | 'contando' | 'sonando';

/** Canal de la alarma. Android no deja cambiar un canal ya creado: si cambia, cambia el id. */
const CANAL_ALARMA = 'alarma-v1';
/** Una alarma que sonó hace más de esto, y nadie atendió, ya no se hace sonar al abrir la app. */
const CADUCIDAD = 60 * 60_000;
/** Vibración mientras suena: medio segundo sí, medio no. */
const PATRON_VIBRACION = [0, 500, 500];

/**
 * El temporizador de la app. Funciona con la hora de fin, no contando segundos: la cuenta atrás
 * es siempre `fin - ahora`, así que no se desajusta aunque la app se cierre o la pantalla se
 * apague. Al empezar programa una notificación de alarma para la hora de fin, que Android hace
 * sonar aunque la app no esté abierta, y muestra una notificación fija con la cuenta atrás.
 */
@Service()
export class Temporizador {
  private readonly almacen = inject(Storage);
  private readonly avisos = inject(Notifications);
  private readonly vibracion = inject(Vibration);
  private readonly sonido = inject(SONIDO);
  private readonly reloj = inject(RELOJ);

  private readonly guardado = this.almacen.signal<Guardado | null>('temporizador', null);
  private readonly ahora = signal(this.reloj());

  readonly titulo = computed(() => this.guardado()?.titulo ?? '');
  readonly detalle = computed(() => this.guardado()?.detalle ?? '');
  /** Milisegundos que faltan; 0 cuando no hay cuenta atrás o ya ha terminado. */
  readonly restante = computed(() => {
    const g = this.guardado();
    return g ? Math.max(0, g.fin - this.ahora()) : 0;
  });
  readonly fase = computed<Fase>(() => {
    const g = this.guardado();
    if (!g || this.ahora() - g.fin > CADUCIDAD) return 'parado';
    return g.fin > this.ahora() ? 'contando' : 'sonando';
  });

  /** La notificación fija con la cuenta atrás, que Android actualiza por su cuenta. */
  private readonly persistente = ongoingNotification(
    computed(() => ({
      title: this.titulo() || 'Temporizador',
      text: this.detalle() || 'Cuenta atrás',
      timer: { until: this.guardado()?.fin ?? this.ahora() },
    })),
    { channel: { id: 'cuenta-atras', name: 'Cuenta atrás' }, url: 'pastatimer://cronometro' },
  );

  constructor() {
    this.avisos.setHandler({
      // Con la app delante, la alarma suena desde la propia app: la notificación no se muestra.
      handleNotification: async () => ({
        shouldShowBanner: false,
        shouldShowList: false,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });

    // El reloj de la pantalla avanza solo mientras hay una cuenta atrás.
    let intervalo: ReturnType<typeof setInterval> | null = null;
    effect(() => {
      const activo = this.guardado() !== null;
      if (activo && !intervalo) intervalo = setInterval(() => this.tic(), 250);
      if (!activo && intervalo) {
        clearInterval(intervalo);
        intervalo = null;
      }
    });
    inject(DestroyRef).onDestroy(() => intervalo && clearInterval(intervalo));

    // Al llegar a cero: suena en bucle y vibra hasta que se apague o se sumen minutos.
    effect(() => {
      const sonando = this.fase() === 'sonando';
      untracked(() => (sonando ? this.empezarAlarma() : this.pararAlarma()));
    });

    // Una alarma vieja que nadie atendió (se quitó la notificación sin abrir la app) se descarta.
    effect(() => {
      if (this.fase() === 'parado' && this.guardado()) untracked(() => void this.apagar());
    });
  }

  /** Avanza el reloj. Lo llama el intervalo; los tests, a mano. */
  tic(): void {
    this.ahora.set(this.reloj());
  }

  /** Empieza una cuenta atrás nueva, sustituyendo la que hubiera. */
  async iniciar(ms: number, titulo: string, detalle: string): Promise<void> {
    await this.cancelarAviso();
    this.tic();
    const fin = this.ahora() + ms;
    this.guardado.set({ fin, titulo, detalle, avisoId: null });
    const avisoId = await this.programarAviso(fin, titulo, detalle);
    this.actualizar({ avisoId });
    void this.persistente.start();
  }

  /** Suma tiempo: a la cuenta atrás si sigue, o desde ahora si ya estaba sonando. */
  async anadir(ms: number): Promise<void> {
    const g = this.guardado();
    if (!g) return;
    await this.cancelarAviso();
    this.tic();
    const fin = Math.max(g.fin, this.ahora()) + ms;
    this.actualizar({ fin, avisoId: null });
    const avisoId = await this.programarAviso(fin, g.titulo, g.detalle);
    this.actualizar({ avisoId });
    void this.persistente.start();
  }

  /** Apaga la alarma, o cancela la cuenta atrás, y lo deja todo parado. */
  async apagar(): Promise<void> {
    await this.cancelarAviso();
    this.guardado.set(null);
    this.persistente.end();
  }

  private actualizar(cambios: Partial<Guardado>): void {
    const g = this.guardado();
    if (g) this.guardado.set({ ...g, ...cambios });
  }

  private async programarAviso(fin: number, titulo: string, detalle: string): Promise<string | null> {
    await this.avisos.permission.ensure();
    await this.avisos.setChannel(CANAL_ALARMA, {
      name: 'Alarma del temporizador',
      description: 'Suena cuando la pasta está lista, aunque el móvil esté en silencio.',
      importance: 7, // AndroidImportance.MAX
      sound: 'alarma.wav',
      audioAttributes: { usage: 4, contentType: 4 }, // ALARM y SONIFICATION: suena en modo silencio
      vibrationPattern: [0, 500, 500, 500],
      enableVibrate: true,
      bypassDnd: true,
      lockscreenVisibility: 1, // PUBLIC: se ve entera en la pantalla de bloqueo
    });
    return this.avisos.schedule({
      content: {
        title: `¡Listo! ${titulo}`.trim(),
        body: detalle ? `${detalle} · Toca para apagar la alarma` : 'Toca para apagar la alarma',
        sound: 'alarma.wav',
        data: { url: '/cronometro' },
      },
      trigger: { type: TriggerType.DATE, date: fin, channelId: CANAL_ALARMA },
    });
  }

  private async cancelarAviso(): Promise<void> {
    const id = this.guardado()?.avisoId;
    if (!id) return;
    await this.avisos.cancel(id);
    await this.avisos.dismiss(id);
  }

  private empezarAlarma(): void {
    this.persistente.end();
    // Quitar la notificación de alarma corta su sonido: a partir de aquí suena la app, en bucle.
    void this.cancelarAviso();
    this.sonido.sonar();
    this.vibracion.pattern(PATRON_VIBRACION, { repeat: true });
  }

  private pararAlarma(): void {
    this.sonido.parar();
    this.vibracion.stop();
  }
}

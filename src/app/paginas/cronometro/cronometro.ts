import { Component, computed, inject, input, numberAttribute, signal, type OnInit } from '@angular/core';
import { Pressable, Text, View } from '@ng-native/components';
import { NativeHeader } from '@ng-native/router';
import { Temporizador } from '../../temporizador/temporizador.ts';

const MIN = 60_000;

/** "9:05", o "1:02:05" a partir de una hora. Redondea hacia arriba: 0,2 s por delante se ve 0:01. */
export function formatear(ms: number): string {
  const total = Math.ceil(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = String(total % 60).padStart(2, '0');
  return h ? `${h}:${String(m).padStart(2, '0')}:${s}` : `${m}:${s}`;
}

/**
 * El temporizador. Desde el detalle de una pasta llega con los minutos del punto elegido en la URL
 * (`?minutos=9&punto=Al dente&pasta=...&marca=...`) y arranca solo. Desde Inicio se abre libre,
 * para elegir el tiempo. Tocar la notificación de la alarma también trae aquí.
 */
@Component({
  imports: [NativeHeader, Pressable, Text, View],
  selector: 'app-cronometro',
  host: { style: 'flex: 1' },
  template: `
    <native-header [title]="pasta() ?? 'Cronómetro'" />
    <view class="pantalla">
      @switch (temporizador.fase()) {
        @case ('parado') {
          <text class="titulo">¿Cuánto tiempo?</text>
          <text class="reloj" accessibilityRole="timer">{{ formatear(eleccion()) }}</text>
          <view class="fila">
            <pressable accessibilityRole="button" accessibilityLabel="Quitar 1 minuto" class="ajuste" (press)="ajustar(-1)">
              <text class="ajuste-texto">−1 min</text>
            </pressable>
            <pressable accessibilityRole="button" accessibilityLabel="Añadir 1 minuto" class="ajuste" (press)="ajustar(1)">
              <text class="ajuste-texto">+1 min</text>
            </pressable>
            <pressable accessibilityRole="button" accessibilityLabel="Añadir 5 minutos" class="ajuste" (press)="ajustar(5)">
              <text class="ajuste-texto">+5 min</text>
            </pressable>
          </view>
          <view class="fila">
            @for (minutos of atajos; track minutos) {
              <pressable
                accessibilityRole="button"
                [accessibilityLabel]="minutos + ' minutos'"
                class="atajo"
                [class.elegido]="eleccion() === minutos * MIN"
                (press)="eleccion.set(minutos * MIN)"
              >
                <text class="atajo-texto">{{ minutos }}′</text>
              </pressable>
            }
          </view>
          <pressable
            accessibilityRole="button"
            accessibilityLabel="Empezar"
            class="principal empezar"
            [disabled]="eleccion() === 0"
            [class.inactivo]="eleccion() === 0"
            (press)="empezar()"
          >
            <text class="principal-texto">Empezar</text>
          </pressable>
        }

        @case ('contando') {
          <text class="titulo">{{ temporizador.titulo() }}</text>
          @if (temporizador.detalle(); as detalle) {
            <text class="detalle">{{ detalle }}</text>
          }
          <text class="reloj" accessibilityRole="timer">{{ formatear(temporizador.restante()) }}</text>
          <pressable accessibilityRole="button" accessibilityLabel="Cancelar" class="secundario" (press)="temporizador.apagar()">
            <text class="secundario-texto">Cancelar</text>
          </pressable>
        }

        @case ('sonando') {
          <text class="listo">¡Listo!</text>
          <text class="titulo">{{ temporizador.titulo() }}</text>
          @if (temporizador.detalle(); as detalle) {
            <text class="detalle">{{ detalle }}</text>
          }
          <pressable accessibilityRole="button" accessibilityLabel="Apagar" class="principal apagar" (press)="temporizador.apagar()">
            <text class="principal-texto">Apagar</text>
          </pressable>
          <pressable
            accessibilityRole="button"
            accessibilityLabel="Añadir 3 minutos"
            class="principal mas"
            (press)="temporizador.anadir(3 * MIN)"
          >
            <text class="principal-texto">+3 min</text>
          </pressable>
        }
      }
    </view>
  `,
  styles: `
    .pantalla {
      flex: 1;
      align-items: center;
      justify-content: center;
      gap: 18px;
      padding: 24px;
      background-color: var(--fondo);
    }
    .titulo {
      color: var(--texto);
      font-family: 'Playfair Display';
      font-size: 24px;
      font-weight: 700;
      text-align: center;
    }
    .detalle {
      margin-top: -12px;
      color: var(--texto-suave);
      font-size: 16px;
    }
    .reloj {
      color: var(--texto);
      font-size: 72px;
      font-weight: 600;
      font-variant: tabular-nums;
    }
    .listo {
      color: var(--texto);
      font-family: 'Playfair Display';
      font-size: 56px;
      font-weight: 700;
    }
    .fila {
      flex-direction: row;
      justify-content: center;
      gap: 10px;
    }
    .ajuste,
    .atajo {
      align-items: center;
      padding: 12px 16px;
      border-radius: 16px;
      border-width: 1px;
      border-color: var(--borde);
      background-color: var(--superficie);
    }
    .atajo {
      min-width: 60px;
    }
    .elegido {
      background-color: var(--melocoton);
    }
    .ajuste:active,
    .atajo:active,
    .principal:active,
    .secundario:active {
      opacity: 0.7;
    }
    .ajuste-texto,
    .atajo-texto {
      color: var(--texto);
      font-size: 16px;
      font-weight: 600;
    }
    .principal {
      width: 100%;
      max-width: 360px;
      align-items: center;
      padding: 20px;
      border-radius: 22px;
      border-width: 1px;
      border-color: var(--borde);
    }
    .inactivo {
      opacity: 0.4;
    }
    .empezar,
    .mas {
      background-color: var(--salvia);
    }
    .apagar {
      background-color: var(--rosa);
    }
    .principal-texto {
      color: var(--texto);
      font-family: 'Playfair Display';
      font-size: 24px;
      font-weight: 700;
    }
    .secundario {
      padding: 12px 24px;
    }
    .secundario-texto {
      color: var(--texto-suave);
      font-size: 17px;
      text-decoration-line: underline;
    }
  `,
})
export class Cronometro implements OnInit {
  protected readonly temporizador = inject(Temporizador);

  /** Query params; vacíos cuando se abre el cronómetro libre. */
  readonly minutos = input(undefined, {
    transform: (v: unknown) => (v == null ? undefined : numberAttribute(v)),
  });
  readonly punto = input<string>();
  readonly pasta = input<string>();
  readonly marca = input<string>();

  protected readonly MIN = MIN;
  protected readonly formatear = formatear;
  protected readonly atajos = [3, 5, 10, 15];
  /** El tiempo elegido en el cronómetro libre. */
  protected readonly eleccion = signal(5 * MIN);

  /** Título de la cuenta atrás: "Espaguetis · Al dente", o "Temporizador" en el libre. */
  private readonly titulo = computed(() =>
    [this.pasta(), this.punto()].filter(Boolean).join(' · ') || 'Temporizador',
  );

  ngOnInit(): void {
    // Desde el detalle de una pasta, la cuenta atrás empieza sola.
    const minutos = this.minutos();
    if (minutos) void this.temporizador.iniciar(minutos * MIN, this.titulo(), this.marca() ?? '');
  }

  protected ajustar(minutos: number): void {
    this.eleccion.update((ms) => Math.min(180 * MIN, Math.max(0, ms + minutos * MIN)));
  }

  protected empezar(): void {
    void this.temporizador.iniciar(this.eleccion(), 'Temporizador', '');
  }
}

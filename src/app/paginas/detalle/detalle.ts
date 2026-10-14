import { Component, computed, inject, input } from '@angular/core';
import { Image, Pressable, ScrollView, Text, View } from '@ng-native/components';
import { SafeArea } from '@ng-native/device';
import { NativeHeader, NativeNavigation } from '@ng-native/router';
import { instruccionesDe, marcaPorId, pastaPorId, puntos, type Punto } from '../../catalogo.ts';
import { imagenDe } from '../../imagenes.ts';

/** Detalle de la pasta elegida: imagen, cómo prepararla y los tres puntos de cocción. */
@Component({
  imports: [Image, NativeHeader, Pressable, ScrollView, Text, View],
  selector: 'app-detalle',
  host: { style: 'flex: 1' },
  template: `
    <native-header [title]="pasta()?.nombre ?? 'Pasta'" />
    <scroll-view class="pantalla">
      @if (eleccion(); as e) {
        <view class="contenido" [style.paddingBottom]="zonaSegura.insets().bottom + 32">
          <image class="imagen" [source]="imagen()" resizeMode="contain" [alt]="e.pasta.nombre" />

          <view class="cabecera">
            <text class="nombre">{{ e.pasta.nombre }}</text>
            <text class="marca">{{ e.marca.nombre }}</text>
            @if (e.tiempos.nota; as nota) {
              <text class="nota">{{ nota }}</text>
            }
          </view>

          <view class="tarjeta">
            <text class="subtitulo">Cómo prepararla</text>
            @for (paso of instrucciones(); track $index) {
              <view class="paso">
                <text class="numero">{{ $index + 1 }}</text>
                <text class="texto">{{ paso }}</text>
              </view>
            }
          </view>

          <text class="pregunta">¿Cómo te gusta?</text>
          <view class="botones">
            @for (punto of puntos; track punto.clave) {
              <pressable
                accessibilityRole="button"
                [accessibilityLabel]="punto.nombre"
                [class]="'boton ' + punto.clave"
                (press)="cocer(punto)"
              >
                <text class="punto">{{ punto.nombre }}</text>
                <text class="minutos">{{ e.tiempos[punto.clave] }} min</text>
              </pressable>
            }
          </view>
        </view>
      } @else {
        <text class="aviso">No hemos encontrado esta pasta o esta marca.</text>
      }
    </scroll-view>
  `,
  styles: `
    .pantalla {
      flex: 1;
      background-color: var(--fondo);
    }
    .contenido {
      align-items: center;
      gap: 20px;
      padding: 16px 20px 32px;
    }
    .imagen {
      width: 220px;
      height: 220px;
    }
    .cabecera {
      align-items: center;
      gap: 4px;
    }
    .nombre {
      color: var(--texto);
      font-family: 'Playfair Display';
      font-size: 28px;
      font-weight: 700;
      text-align: center;
    }
    .marca {
      color: var(--texto-suave);
      font-size: 17px;
    }
    .nota {
      margin-top: 4px;
      padding: 2px 10px;
      border-radius: 8px;
      background-color: var(--salvia);
      color: var(--texto);
      font-size: 12px;
    }
    .tarjeta {
      align-self: stretch;
      gap: 12px;
      padding: 18px;
      border-radius: 20px;
      background-color: var(--superficie);
      border-width: 1px;
      border-color: var(--borde);
    }
    .subtitulo {
      color: var(--texto);
      font-family: 'Playfair Display';
      font-size: 19px;
      font-weight: 700;
    }
    .paso {
      flex-direction: row;
      gap: 10px;
    }
    .numero {
      width: 24px;
      height: 24px;
      border-radius: 12px;
      background-color: var(--melocoton);
      color: var(--texto);
      font-size: 13px;
      font-weight: 600;
      text-align: center;
      line-height: 24px;
    }
    .texto {
      flex: 1;
      color: var(--texto);
      font-size: 15px;
      line-height: 22px;
    }
    .pregunta {
      color: var(--texto);
      font-family: 'Playfair Display';
      font-size: 22px;
      font-weight: 700;
    }
    .botones {
      align-self: stretch;
      align-items: center;
      gap: 12px;
    }
    .boton {
      width: 100%;
      max-width: 360px;
      align-items: center;
      gap: 2px;
      padding: 16px;
      border-radius: 20px;
      border-width: 1px;
      border-color: var(--borde);
    }
    .boton:active {
      opacity: 0.7;
    }
    .al_dente {
      background-color: var(--melocoton);
    }
    .suave {
      background-color: var(--salvia);
    }
    .salsa {
      background-color: var(--rosa);
    }
    .punto {
      color: var(--texto);
      font-family: 'Playfair Display';
      font-size: 20px;
      font-weight: 700;
    }
    .minutos {
      color: var(--texto-suave);
      font-size: 15px;
    }
    .aviso {
      padding: 24px;
      color: var(--texto-suave);
      font-size: 16px;
      text-align: center;
    }
  `,
})
export class Detalle {
  /** Hueco de la barra de botones de Android abajo, para que el último elemento no quede tapado. */
  protected readonly zonaSegura = inject(SafeArea);

  private readonly nav = inject(NativeNavigation);

  /** El `:pasta` de la ruta. */
  readonly pasta = input.required({ transform: pastaPorId });
  /** El `:marca` de la ruta. */
  readonly marca = input.required({ transform: marcaPorId });

  protected readonly puntos = puntos;

  /** La pasta, la marca y sus tiempos; `null` si la ruta no corresponde a nada del catálogo. */
  protected readonly eleccion = computed(() => {
    const pasta = this.pasta();
    const marca = this.marca();
    const tiempos = pasta && marca ? pasta.tiempos[marca.nombre] : null;
    return pasta && marca && tiempos ? { pasta, marca, tiempos } : null;
  });

  protected readonly imagen = computed(() => imagenDe(this.pasta()?.id ?? ''));

  protected readonly instrucciones = computed(() => {
    const e = this.eleccion();
    return e ? instruccionesDe(e.pasta, e.tiempos) : [];
  });

  /** Abre el temporizador con los minutos de ese punto de cocción. */
  protected cocer(punto: Punto): void {
    const e = this.eleccion();
    if (!e) return;
    void this.nav.push(['/cronometro'], {
      queryParams: {
        minutos: e.tiempos[punto.clave],
        punto: punto.nombre,
        pasta: e.pasta.nombre,
        marca: e.marca.nombre,
      },
    });
  }
}

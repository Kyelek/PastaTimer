import { Component, computed, input } from '@angular/core';
import { Pressable, ScrollView, Text, View } from '@ng-native/components';
import { NativeHeader, NativeRouterLink } from '@ng-native/router';
import { opcionesDe, pastaPorId } from '../../catalogo.ts';

/** Elegir la marca de la pasta. Solo aparecen las marcas que venden ese tipo. */
@Component({
  imports: [NativeHeader, NativeRouterLink, Pressable, ScrollView, Text, View],
  selector: 'app-marcas',
  host: { style: 'flex: 1' },
  template: `
    <native-header [title]="pasta()?.nombre ?? 'Pasta'" />
    <scroll-view class="pantalla" contentInsetAdjustmentBehavior="automatic">
      @if (pasta(); as pasta) {
        <view class="lista">
          <text class="pregunta">¿De qué marca es tu pasta?</text>
          @for (opcion of opciones(); track opcion.marca.id) {
            <pressable
              accessibilityRole="button"
              [accessibilityLabel]="opcion.marca.nombre"
              class="fila"
              [nativeRouterLink]="['/pastas', pasta.id, opcion.marca.id]"
            >
              <view class="textos">
                <text class="nombre">{{ opcion.marca.nombre }}</text>
                @if (opcion.tiempos.nota; as nota) {
                  <text class="nota">{{ nota }}</text>
                }
              </view>
              <text class="flecha">›</text>
            </pressable>
          }
        </view>
      } @else {
        <text class="aviso">No hemos encontrado esta pasta.</text>
      }
    </scroll-view>
  `,
  styles: `
    .pantalla {
      flex: 1;
      background-color: var(--fondo);
    }
    .lista {
      gap: 12px;
      padding: 16px;
    }
    .pregunta {
      color: var(--texto-suave);
      font-size: 16px;
      margin-bottom: 4px;
    }
    .fila {
      flex-direction: row;
      align-items: center;
      gap: 14px;
      padding: 18px;
      border-radius: 18px;
      background-color: var(--superficie);
      border-width: 1px;
      border-color: var(--borde);
    }
    .fila:active {
      opacity: 0.7;
    }
    .textos {
      flex: 1;
      gap: 4px;
    }
    .nombre {
      color: var(--texto);
      font-size: 17px;
      font-weight: 600;
    }
    .nota {
      align-self: flex-start;
      padding: 2px 8px;
      border-radius: 8px;
      background-color: var(--salvia);
      color: var(--texto);
      font-size: 12px;
    }
    .flecha {
      color: var(--texto-suave);
      font-size: 28px;
    }
    .aviso {
      padding: 24px;
      color: var(--texto-suave);
      font-size: 16px;
      text-align: center;
    }
  `,
})
export class Marcas {
  /** El `:pasta` de la ruta. */
  readonly pasta = input.required({ transform: pastaPorId });

  protected readonly opciones = computed(() => {
    const pasta = this.pasta();
    return pasta ? opcionesDe(pasta) : [];
  });
}

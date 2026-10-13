import { Component, computed, input, numberAttribute } from '@angular/core';
import { Text, View } from '@ng-native/components';
import { NativeHeader } from '@ng-native/router';

/**
 * Temporizador. Desde Inicio se abre libre; desde el detalle de una pasta llega con los minutos
 * del punto elegido en la URL (`?minutos=9&punto=Al dente&pasta=...&marca=...`). La cuenta atrás
 * llega en T-05.
 */
@Component({
  imports: [NativeHeader, Text, View],
  selector: 'app-cronometro',
  host: { style: 'flex: 1' },
  template: `
    <native-header [title]="pasta() ?? 'Cronómetro'" />
    <view class="pantalla">
      @if (minutos(); as minutos) {
        <text class="punto">{{ punto() }}</text>
        <text class="tiempo">{{ minutos }}:00</text>
        @if (marca(); as marca) {
          <text class="marca">{{ marca }}</text>
        }
      }
      <text class="aviso">{{ aviso() }}</text>
    </view>
  `,
  styles: `
    .pantalla {
      flex: 1;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 24px;
      background-color: var(--fondo);
    }
    .punto {
      color: var(--texto);
      font-family: 'Playfair Display';
      font-size: 24px;
      font-weight: 700;
    }
    .tiempo {
      color: var(--texto);
      font-size: 64px;
      font-weight: 600;
    }
    .marca {
      color: var(--texto-suave);
      font-size: 16px;
    }
    .aviso {
      margin-top: 16px;
      color: var(--texto-suave);
      font-size: 15px;
      text-align: center;
    }
  `,
})
export class Cronometro {
  /** Query params; vacíos cuando se abre el cronómetro libre. */
  readonly minutos = input(undefined, { transform: (v: unknown) => (v == null ? undefined : numberAttribute(v)) });
  readonly punto = input<string>();
  readonly pasta = input<string>();
  readonly marca = input<string>();

  protected readonly aviso = computed(() =>
    this.minutos() ? 'La cuenta atrás llegará en la siguiente tarea.' : 'Aquí irá el temporizador.',
  );
}

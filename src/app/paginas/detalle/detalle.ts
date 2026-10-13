import { Component, input } from '@angular/core';
import { Text, View } from '@ng-native/components';
import { NativeHeader } from '@ng-native/router';
import { marcaPorId, pastaPorId } from '../../catalogo.ts';

/** Detalle de la pasta elegida. De momento solo confirma la elección: el resto llega en T-04. */
@Component({
  imports: [NativeHeader, Text, View],
  selector: 'app-detalle',
  host: { style: 'flex: 1' },
  template: `
    <native-header [title]="pasta()?.nombre ?? 'Pasta'" />
    <view class="pantalla">
      <text class="nombre">{{ pasta()?.nombre }}</text>
      <text class="marca">{{ marca()?.nombre }}</text>
      <text class="aviso">Aquí irán las instrucciones y los botones de cocción.</text>
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
    .nombre {
      color: var(--texto);
      font-family: 'Playfair Display';
      font-size: 26px;
      font-weight: 700;
    }
    .marca {
      color: var(--texto);
      font-size: 17px;
    }
    .aviso {
      margin-top: 16px;
      color: var(--texto-suave);
      font-size: 15px;
      text-align: center;
    }
  `,
})
export class Detalle {
  /** El `:pasta` de la ruta. */
  readonly pasta = input.required({ transform: pastaPorId });
  /** El `:marca` de la ruta. */
  readonly marca = input.required({ transform: marcaPorId });
}

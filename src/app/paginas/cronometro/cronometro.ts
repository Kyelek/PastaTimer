import { Component } from '@angular/core';
import { Text, View } from '@ng-native/components';
import { NativeHeader } from '@ng-native/router';

/** Temporizador. De momento vacío: su lógica llega en T-05. */
@Component({
  imports: [NativeHeader, Text, View],
  selector: 'app-cronometro',
  host: { style: 'flex: 1' },
  template: `
    <native-header title="Cronómetro" />
    <view class="pantalla">
      <text class="aviso">Aquí irá el temporizador.</text>
    </view>
  `,
  styles: `
    .pantalla {
      flex: 1;
      align-items: center;
      justify-content: center;
      background-color: var(--fondo);
    }
    .aviso {
      color: var(--texto-suave);
      font-size: 16px;
    }
  `,
})
export class Cronometro {}

import { Component } from '@angular/core';
import { Text, View } from '@ng-native/components';
import { NativeHeader } from '@ng-native/router';

/** Listado de tipos de pasta. De momento vacío: el listado llega en T-03. */
@Component({
  imports: [NativeHeader, Text, View],
  selector: 'app-pastas',
  host: { style: 'flex: 1' },
  template: `
    <native-header title="Pasta" />
    <view class="pantalla">
      <text class="aviso">Aquí irá el listado de pastas.</text>
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
export class Pastas {}

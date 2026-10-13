import { Component, inject } from '@angular/core';
import { SafeAreaProvider } from '@ng-native/components';
import { ColorScheme, StatusBar } from '@ng-native/device';
import { NativeStackOutlet } from '@ng-native/router';

/** Raíz de la app: la pila de pantallas y la paleta pastel que heredan todas ellas. */
@Component({
  imports: [NativeStackOutlet, SafeAreaProvider],
  selector: 'app-root',
  template: `
    <safe-area-provider>
      <native-stack-outlet />
    </safe-area-provider>
  `,
  styles: `
    :host {
      flex: 1;
      --fondo: #fff8ee;
      --superficie: #ffffff;
      --borde: #f1e4d3;
      --texto: #4a3f35;
      --texto-suave: #8a7d70;
      --melocoton: #ffd8be;
      --salvia: #cde5d0;
    }
  `,
})
export class App {
  constructor() {
    // La app es siempre clara (tonos pastel), aunque el sistema esté en modo oscuro.
    inject(ColorScheme).set('light');
    inject(StatusBar).set({ style: 'dark' });
  }
}

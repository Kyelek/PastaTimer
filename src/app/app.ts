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
      --fondo: #f9ecd8;
      --superficie: #ffffff;
      --borde: #ecd9bf;
      --texto: #4a3f35;
      --texto-suave: #8a7d70;
      --melocoton: #ffcfae;
      --salvia: #c7e3cb;
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

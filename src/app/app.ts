import { Component, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SafeAreaProvider } from '@ng-native/components';
import { ColorScheme, StatusBar } from '@ng-native/device';
import { Notifications } from '@ng-native/expo/notifications';
import { NativeStackOutlet } from '@ng-native/router';
import { Temporizador } from './temporizador/temporizador.ts';

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
      --rosa: #f6d6d6;
    }
  `,
})
export class App {
  constructor() {
    // La app es siempre clara (tonos pastel), aunque el sistema esté en modo oscuro.
    inject(ColorScheme).set('light');
    inject(StatusBar).set({ style: 'dark' });

    // Crea el temporizador al arrancar: recupera una cuenta atrás en curso y hace sonar la alarma
    // si ya ha llegado a cero.
    inject(Temporizador);

    // Tocar la notificación de la alarma abre la pantalla del temporizador, también si fue ese
    // toque el que arrancó la app.
    const avisos = inject(Notifications);
    const router = inject(Router);
    effect(() => {
      const toque = avisos.take();
      const url = toque?.notification.request.content.data?.['url'];
      if (typeof url === 'string') void router.navigateByUrl(url);
    });
  }
}

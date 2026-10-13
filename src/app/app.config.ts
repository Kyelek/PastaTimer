import { withComponentInputBinding } from '@angular/router';
import { provideNativeRouter, withHeaderDefaults } from '@ng-native/router';
import { routes } from './app.routes.ts';
import { colores } from './tema.ts';

/** Proveedores de la app. Los usan `main.ts` y los tests, para que ambos naveguen igual. */
export const appProviders = [
  provideNativeRouter(
    routes,
    withComponentInputBinding(),
    withHeaderDefaults({
      backgroundColor: colores.fondo,
      titleColor: colores.texto,
      color: colores.texto,
      userInterfaceStyle: 'light',
      hideShadow: true,
    }),
  ),
];

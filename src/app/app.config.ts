import { withComponentInputBinding } from '@angular/router';
import { Notifications } from '@ng-native/expo/notifications';
import { provideNativeRouter, withHeaderDefaults } from '@ng-native/router';
import { routes } from './app.routes.ts';
import { colores } from './tema.ts';

/**
 * Expo Go ya no trae todo lo que necesita `expo-notifications` (desde el SDK 53), y sin él la app no
 * arranca. Solo en Expo Go, las notificaciones se quedan inactivas para poder probar las pantallas:
 * la alarma con la app cerrada se prueba en el development build. Fuera de Expo Go, que falte el
 * módulo sigue siendo un error.
 */
function notificacionesNativas() {
  // Se mira antes de cargarlo: en Expo Go, cargar expo-notifications ya lanza un error.
  const enExpoGo = require('expo-constants').default.executionEnvironment === 'storeClient';
  return enExpoGo ? null : require('expo-notifications');
}

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
  { provide: Notifications.SOURCE, useFactory: notificacionesNativas },
];

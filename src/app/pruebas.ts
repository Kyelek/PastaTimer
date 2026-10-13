import { Storage } from '@ng-native/expo/async-storage';
import { Notifications, type NativeNotifications } from '@ng-native/expo/notifications';
import { Store } from '@ng-native/expo/store';
import { appProviders } from './app.config.ts';
import { RELOJ, SONIDO } from './temporizador/temporizador.ts';

/**
 * Dobles para los tests: el reloj, el sonido, las notificaciones y el almacenamiento del móvil,
 * que en Node no existen. Cada test crea los suyos con `dobles()` y los inspecciona después.
 */
export function dobles(inicio = Date.UTC(2026, 9, 14, 12, 0, 0)) {
  const reloj = { ahora: inicio };
  const sonido = { sonando: false };
  const disco = new Map<string, string>();
  const programadas = new Map<string, { title?: string | null; body?: string | null; fecha: number }>();
  let siguienteId = 1;

  const avisos = {
    getLastNotificationResponseAsync: async () => null,
    clearLastNotificationResponseAsync: async () => undefined,
    addNotificationReceivedListener: () => ({ remove() {} }),
    addNotificationResponseReceivedListener: () => ({ remove() {} }),
    addNotificationsDroppedListener: () => ({ remove() {} }),
    addPushTokenListener: () => ({ remove() {} }),
    getPermissionsAsync: async () => ({ granted: true, status: 'granted', canAskAgain: true, expires: 'never' }),
    requestPermissionsAsync: async () => ({ granted: true, status: 'granted', canAskAgain: true, expires: 'never' }),
    setNotificationHandler: () => undefined,
    setNotificationChannelAsync: async () => null,
    scheduleNotificationAsync: async (request: {
      content: { title?: string | null; body?: string | null };
      trigger: { date: number };
    }) => {
      const id = `aviso-${siguienteId++}`;
      programadas.set(id, { title: request.content.title, body: request.content.body, fecha: request.trigger.date });
      return id;
    },
    cancelScheduledNotificationAsync: async (id: string) => void programadas.delete(id),
    dismissNotificationAsync: async () => undefined,
  };

  const providers = [
    ...appProviders,
    { provide: RELOJ, useValue: () => reloj.ahora },
    {
      provide: SONIDO,
      useValue: {
        sonar: () => (sonido.sonando = true),
        parar: () => (sonido.sonando = false),
      },
    },
    { provide: Notifications.SOURCE, useValue: avisos as unknown as NativeNotifications },
    {
      provide: Storage,
      useValue: new Store({
        get: async (clave) => disco.get(clave) ?? null,
        set: async (clave, valor) => void disco.set(clave, valor),
        remove: async (clave) => void disco.delete(clave),
      }),
    },
  ];

  return { providers, reloj, sonido, programadas, disco };
}

import { Router } from '@angular/router';
import { render, screen, userEvent, waitFor } from '@ng-native/testing';
import { expect, test } from 'vitest';
import { App } from '../../app.ts';
import { dobles } from '../../pruebas.ts';
import { Temporizador } from '../../temporizador/temporizador.ts';
import { formatear } from './cronometro.ts';

const MIN = 60_000;

async function abrir(url: string, d = dobles()) {
  const { componentRef } = await render(App, { providers: d.providers });
  await componentRef.injector.get(Router).navigateByUrl(url);
  return { ...d, temporizador: componentRef.injector.get(Temporizador) };
}

test('formatear muestra minutos y segundos, y horas si hacen falta', () => {
  expect(formatear(9 * MIN)).toBe('9:00');
  expect(formatear(65_000)).toBe('1:05');
  expect(formatear(200)).toBe('0:01');
  expect(formatear(0)).toBe('0:00');
  expect(formatear(62 * MIN + 5_000)).toBe('1:02:05');
});

test('el cronómetro libre empieza en 5 minutos y se ajusta con los botones y los atajos', async () => {
  await abrir('/cronometro');
  const usuario = userEvent.setup();

  expect(await screen.findByText('5:00')).toBeTruthy();
  await usuario.press(screen.getByRole('button', { name: 'Añadir 5 minutos' }));
  await usuario.press(screen.getByRole('button', { name: 'Añadir 1 minuto' }));
  expect(screen.getByText('11:00')).toBeTruthy();
  await usuario.press(screen.getByRole('button', { name: 'Quitar 1 minuto' }));
  expect(screen.getByText('10:00')).toBeTruthy();

  await usuario.press(screen.getByRole('button', { name: '3 minutos' }));
  expect(screen.getByText('3:00')).toBeTruthy();
});

test('Empezar arranca la cuenta atrás y programa la alarma', async () => {
  const { programadas, reloj } = await abrir('/cronometro');

  await userEvent.setup().press(await screen.findByRole('button', { name: '10 minutos' }));
  await userEvent.setup().press(screen.getByRole('button', { name: 'Empezar' }));

  expect(await screen.findByRole('button', { name: 'Cancelar' })).toBeTruthy();
  expect(screen.getByText('10:00')).toBeTruthy();
  expect([...programadas.values()].map((p) => p.fecha)).toEqual([reloj.ahora + 10 * MIN]);
});

test('desde el detalle de una pasta prepara su tiempo y no empieza hasta pulsar Empezar', async () => {
  const { temporizador, programadas, reloj } = await abrir(
    '/cronometro?minutos=9&punto=Al%20dente&pasta=Espaguetis&marca=Barilla',
  );

  expect(await screen.findByText('Espaguetis · Al dente')).toBeTruthy();
  expect(screen.getByText('Barilla')).toBeTruthy();
  expect(screen.getByText('9:00')).toBeTruthy();
  expect(temporizador.fase()).toBe('parado');
  expect(programadas.size).toBe(0);
  // El tiempo lo da la pasta: no hay botones para cambiarlo.
  expect(screen.queryByRole('button', { name: 'Añadir 1 minuto' })).toBeNull();

  await userEvent.setup().press(screen.getByRole('button', { name: 'Empezar' }));

  expect(await screen.findByRole('button', { name: 'Cancelar' })).toBeTruthy();
  expect(temporizador.titulo()).toBe('Espaguetis · Al dente');
  expect(temporizador.detalle()).toBe('Barilla');
  expect([...programadas.values()].map((p) => p.fecha)).toEqual([reloj.ahora + 9 * MIN]);
});

test('al llegar a cero muestra ¡Listo! con Apagar y +3 min', async () => {
  const { temporizador, reloj, sonido } = await abrir('/cronometro?minutos=1&pasta=Penne&punto=Suave');
  await userEvent.setup().press(await screen.findByRole('button', { name: 'Empezar' }));
  await screen.findByRole('button', { name: 'Cancelar' });

  reloj.ahora += MIN;
  temporizador.tic();

  expect(await screen.findByText('¡Listo!')).toBeTruthy();
  await waitFor(() => expect(sonido.sonando).toBe(true));

  await userEvent.setup().press(screen.getByRole('button', { name: 'Añadir 3 minutos' }));
  expect(await screen.findByText('3:00')).toBeTruthy();
  await waitFor(() => expect(sonido.sonando).toBe(false));
});

test('Apagar para la alarma y deja otra vez el tiempo preparado', async () => {
  const { temporizador, reloj, sonido } = await abrir('/cronometro?minutos=1');
  await userEvent.setup().press(await screen.findByRole('button', { name: 'Empezar' }));
  await screen.findByRole('button', { name: 'Cancelar' });
  reloj.ahora += MIN;
  temporizador.tic();
  await screen.findByText('¡Listo!');

  await userEvent.setup().press(screen.getByRole('button', { name: 'Apagar' }));

  expect(await screen.findByRole('button', { name: 'Empezar' })).toBeTruthy();
  expect(screen.getByText('1:00')).toBeTruthy();
  await waitFor(() => expect(sonido.sonando).toBe(false));
});

import { render, screen, userEvent } from '@ng-native/testing';
import { expect, test } from 'vitest';
import { appProviders } from './app.config.ts';
import { App } from './app.ts';

test('la pantalla principal ofrece el cronómetro y la pasta', async () => {
  await render(App, { providers: appProviders });

  expect(await screen.findByText('Tiempos para pasta')).toBeTruthy();
  expect(screen.getByRole('button', { name: 'Cronómetro' })).toBeTruthy();
  expect(screen.getByRole('button', { name: 'Pasta' })).toBeTruthy();
});

test('pulsar Cronómetro abre el temporizador', async () => {
  await render(App, { providers: appProviders });

  await userEvent.setup().press(await screen.findByRole('button', { name: 'Cronómetro' }));

  expect(await screen.findByText('Aquí irá el temporizador.')).toBeTruthy();
});

test('pulsar Pasta abre el listado de pastas', async () => {
  await render(App, { providers: appProviders });

  await userEvent.setup().press(await screen.findByRole('button', { name: 'Pasta' }));

  expect(await screen.findByText('Aquí irá el listado de pastas.')).toBeTruthy();
});

test('las pantallas apiladas heredan la paleta pastel', async () => {
  await render(App, { providers: appProviders });

  await userEvent.setup().press(await screen.findByRole('button', { name: 'Pasta' }));
  const aviso = await screen.findByText('Aquí irá el listado de pastas.');

  // --texto-suave, declarado en el :host de App
  expect(aviso.props['color']).toBe('rgb(138, 125, 112)');
});

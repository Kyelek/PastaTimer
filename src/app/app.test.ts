import { styleSheetOf } from '@ng-native/fabric';
import { render, screen, userEvent } from '@ng-native/testing';
import { expect, test } from 'vitest';
import { appProviders } from './app.config.ts';
import { App } from './app.ts';
import { EstilosGlobales } from './estilos-globales.ts';

test('la pantalla principal ofrece primero la pasta y después el cronómetro', async () => {
  await render(App, { providers: appProviders });

  expect(await screen.findByText('Tiempos para la cocción de la pasta')).toBeTruthy();
  expect(screen.getByText('Elige el tipo de pasta y la marca')).toBeTruthy();
  const botones = screen.getAllByRole('button').map((boton) => boton.props['accessibilityLabel']);
  expect(botones).toEqual(['Pasta', 'Cronómetro']);
});

test('los títulos usan Playfair Display y el resto del texto Lora', async () => {
  await render(App, { providers: appProviders, globalStyles: styleSheetOf(EstilosGlobales) });

  const titulo = await screen.findByText('Tiempos para la cocción de la pasta');
  expect(titulo.props['fontFamily']).toMatch(/^Playfair Display/);
  expect(screen.getByText('Temporizador libre').props['fontFamily']).toMatch(/^Lora/);
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

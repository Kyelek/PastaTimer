import { Router } from '@angular/router';
import { render, screen, userEvent } from '@ng-native/testing';
import { expect, test } from 'vitest';
import { appProviders } from '../../app.config.ts';
import { App } from '../../app.ts';
import { pastas } from '../../catalogo.ts';
import { imagenDe } from '../../imagenes.ts';

async function abrir(url: string) {
  const { componentRef } = await render(App, { providers: appProviders });
  await componentRef.injector.get(Router).navigateByUrl(url);
}

test('cada pasta del catálogo tiene su imagen', () => {
  for (const pasta of pastas) {
    expect(imagenDe(pasta.id), pasta.id).toBeDefined();
  }
});

test('el detalle muestra la imagen, la marca, las instrucciones y los tres botones con sus minutos', async () => {
  await abrir('/pastas/espaguetis/barilla');

  expect(await screen.findByText('Cómo prepararla')).toBeTruthy();
  expect(screen.getByLabelText('Espaguetis')).toBeTruthy(); // la imagen, por su alt
  expect(screen.getByText('Barilla')).toBeTruthy();
  expect(screen.getByText(/1 litro por cada 100 g/)).toBeTruthy();

  // Barilla espaguetis: 8 / 10 / 6
  // Las pantallas de debajo siguen montadas en la pila: los tres últimos botones son los del detalle.
  const botones = screen.getAllByRole('button').map((b) => b.props['accessibilityLabel']);
  expect(botones.slice(-3)).toEqual(['Al dente', 'Suave', 'Terminar en salsa']);
  expect(screen.getByText('8 min')).toBeTruthy();
  expect(screen.getByText('10 min')).toBeTruthy();
  expect(screen.getByText('6 min')).toBeTruthy();
});

test('las instrucciones se adaptan a la pasta fresca y a los fideos', async () => {
  await abrir('/pastas/espaguetis/giovanni-rana');
  expect(await screen.findByText(/Es pasta fresca/)).toBeTruthy();

  await abrir('/pastas/fideos_n1/pastas-gallo');
  expect(await screen.findByText(/Para sopa/)).toBeTruthy();
});

test('pulsar un punto de cocción abre el temporizador con sus minutos', async () => {
  await abrir('/pastas/espaguetis/barilla');

  await userEvent.setup().press(await screen.findByRole('button', { name: 'Suave' }));

  expect(await screen.findByText('10:00')).toBeTruthy();
  expect(screen.getAllByText('Suave').length).toBe(2); // el botón del detalle y el título del temporizador
});

test('una marca que no vende esa pasta muestra un aviso', async () => {
  await abrir('/pastas/macarrones/giovanni-rana');

  expect(await screen.findByText('No hemos encontrado esta pasta o esta marca.')).toBeTruthy();
});

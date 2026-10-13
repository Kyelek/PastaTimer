import { Router } from '@angular/router';
import { render, screen, userEvent } from '@ng-native/testing';
import { expect, test } from 'vitest';
import { appProviders } from '../../app.config.ts';
import { App } from '../../app.ts';
import { marcas, opcionesDe, pastaPorId, pastas } from '../../catalogo.ts';

async function abrir(url: string) {
  const { componentRef } = await render(App, { providers: appProviders });
  await componentRef.injector.get(Router).navigateByUrl(url);
}

test('el catálogo carga las 10 pastas y las 7 marcas de pastas.json', () => {
  expect(pastas).toHaveLength(10);
  expect(marcas.map((marca) => marca.id)).toEqual([
    'pastas-gallo',
    'barilla',
    'hacendado-mercadona',
    'combino-lidl',
    'de-cecco',
    'garofalo-rummo',
    'giovanni-rana',
  ]);
});

test('una marca sin tiempos (null) no se ofrece para esa pasta', () => {
  const nombres = (id: string) => opcionesDe(pastaPorId(id)!).map((o) => o.marca.nombre);

  expect(nombres('espaguetis')).toContain('Giovanni Rana');
  expect(nombres('macarrones')).not.toContain('Giovanni Rana');
  expect(nombres('macarrones')).toHaveLength(5);
});

test('el listado muestra todos los tipos de pasta', async () => {
  await abrir('/pastas');

  expect(await screen.findByRole('button', { name: 'Espaguetis' })).toBeTruthy();
  for (const pasta of pastas) {
    expect(screen.getByRole('button', { name: pasta.nombre })).toBeTruthy();
  }
});

test('elegir una pasta muestra sus marcas, con la nota si la hay', async () => {
  await abrir('/pastas');

  await userEvent.setup().press(await screen.findByRole('button', { name: 'Espaguetis' }));

  expect(await screen.findByText('¿De qué marca es tu pasta?')).toBeTruthy();
  expect(screen.getByRole('button', { name: 'Barilla' })).toBeTruthy();
  expect(screen.getByRole('button', { name: 'Giovanni Rana' })).toBeTruthy();
  expect(screen.getByText('Pasta fresca')).toBeTruthy();
});

test('elegir la marca abre el detalle de esa pasta y marca', async () => {
  await abrir('/pastas/macarrones');

  await userEvent.setup().press(await screen.findByRole('button', { name: 'Hacendado (Mercadona)' }));

  expect(await screen.findByText('Aquí irán las instrucciones y los botones de cocción.')).toBeTruthy();
  expect(screen.getAllByText('Hacendado (Mercadona)').length).toBeGreaterThan(0);
});

test('una pasta que no existe muestra un aviso en lugar de fallar', async () => {
  await abrir('/pastas/no-existe');

  expect(await screen.findByText('No hemos encontrado esta pasta.')).toBeTruthy();
});

test('el buscador de pastas filtra sin distinguir mayúsculas ni tildes', async () => {
  await abrir('/pastas');
  const usuario = userEvent.setup();

  await usuario.type(await screen.findByLabelText('Buscar pasta'), 'MACARRÓN');

  expect(screen.getByRole('button', { name: 'Macarrones' })).toBeTruthy();
  expect(screen.queryByRole('button', { name: 'Espaguetis' })).toBeNull();
});

test('el buscador avisa cuando no hay resultados y se puede borrar', async () => {
  await abrir('/pastas');
  const usuario = userEvent.setup();

  await usuario.type(await screen.findByLabelText('Buscar pasta'), 'lasaña');
  expect(screen.getByText('Ninguna pasta coincide con «lasaña».')).toBeTruthy();

  await usuario.press(screen.getByRole('button', { name: 'Borrar búsqueda' }));
  expect(screen.getByRole('button', { name: 'Espaguetis' })).toBeTruthy();
});

test('el buscador de marcas filtra las marcas de esa pasta', async () => {
  await abrir('/pastas/espaguetis');

  await userEvent.setup().type(await screen.findByLabelText('Buscar marca'), 'lidl');

  expect(screen.getByRole('button', { name: 'Combino (Lidl)' })).toBeTruthy();
  expect(screen.queryByRole('button', { name: 'Barilla' })).toBeNull();
});

test('al escribir en el buscador se quita el placeholder, para que el cursor quede centrado', async () => {
  await abrir('/pastas');
  const campo = await screen.findByLabelText('Buscar pasta');
  expect(campo.props['placeholder']).toBe('Buscar pasta');

  await userEvent.setup().type(campo, 'pen', { skipBlur: true });

  expect(screen.getByLabelText('Buscar pasta').props['placeholder']).toBe('');
});

test('todos los tiempos son coherentes: salsa < al dente < suave, y salsa de al menos 1 minuto', () => {
  for (const pasta of pastas) {
    for (const { marca, tiempos } of opcionesDe(pasta)) {
      const { al_dente, suave, salsa } = tiempos;
      expect(salsa >= 1 && salsa < al_dente && al_dente < suave, `${pasta.id} · ${marca.nombre}`).toBe(true);
    }
  }
});

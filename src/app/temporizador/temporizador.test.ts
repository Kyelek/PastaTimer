import { render, waitFor } from '@ng-native/testing';
import { expect, test } from 'vitest';
import { App } from '../app.ts';
import { dobles } from '../pruebas.ts';
import { Temporizador } from './temporizador.ts';

const MIN = 60_000;

async function arrancar(d = dobles()) {
  const { componentRef } = await render(App, { providers: d.providers });
  return { ...d, temporizador: componentRef.injector.get(Temporizador) };
}

test('iniciar empieza la cuenta atrás y programa la alarma para la hora de fin', async () => {
  const { temporizador, programadas, reloj } = await arrancar();

  await temporizador.iniciar(9 * MIN, 'Espaguetis · Al dente', 'Barilla');

  expect(temporizador.fase()).toBe('contando');
  expect(temporizador.restante()).toBe(9 * MIN);
  expect([...programadas.values()]).toEqual([
    { title: '¡Listo! Espaguetis · Al dente', body: 'Barilla · Toca para apagar la alarma', fecha: reloj.ahora + 9 * MIN },
  ]);
});

test('la cuenta atrás sale de la hora de fin, no de contar segundos', async () => {
  const { temporizador, reloj } = await arrancar();
  await temporizador.iniciar(9 * MIN, 'Pasta', '');

  reloj.ahora += 4 * MIN + 30_000; // la app pudo estar cerrada todo este rato
  temporizador.tic();

  expect(temporizador.restante()).toBe(4 * MIN + 30_000);
});

test('al llegar a cero suena en la app y se quita la notificación de alarma', async () => {
  const { temporizador, reloj, sonido, programadas } = await arrancar();
  await temporizador.iniciar(1 * MIN, 'Pasta', '');

  reloj.ahora += 1 * MIN;
  temporizador.tic();

  expect(temporizador.fase()).toBe('sonando');
  await waitFor(() => expect(sonido.sonando).toBe(true));
  await waitFor(() => expect(programadas.size).toBe(0));
});

test('+3 min mientras suena para la alarma y vuelve a contar 3 minutos desde ahora', async () => {
  const { temporizador, reloj, sonido, programadas } = await arrancar();
  await temporizador.iniciar(1 * MIN, 'Pasta', '');
  reloj.ahora += 2 * MIN; // terminó hace un minuto
  temporizador.tic();
  await waitFor(() => expect(sonido.sonando).toBe(true));

  await temporizador.anadir(3 * MIN);

  expect(temporizador.fase()).toBe('contando');
  expect(temporizador.restante()).toBe(3 * MIN);
  await waitFor(() => expect(sonido.sonando).toBe(false));
  expect([...programadas.values()].map((p) => p.fecha)).toEqual([reloj.ahora + 3 * MIN]);
});

test('apagar lo deja todo parado y sin alarmas programadas', async () => {
  const { temporizador, programadas } = await arrancar();
  await temporizador.iniciar(5 * MIN, 'Pasta', '');

  await temporizador.apagar();

  expect(temporizador.fase()).toBe('parado');
  expect(programadas.size).toBe(0);
});

test('si la app se cerró, al volver a abrirla recupera la cuenta atrás', async () => {
  const d = dobles();
  d.disco.set('temporizador', JSON.stringify({ fin: d.reloj.ahora + 5 * MIN, titulo: 'Penne', detalle: '', avisoId: null }));

  const { temporizador } = await arrancar(d);

  await waitFor(() => expect(temporizador.fase()).toBe('contando'));
  expect(temporizador.titulo()).toBe('Penne');
  expect(temporizador.restante()).toBe(5 * MIN);
});

test('si la alarma sonó con la app cerrada, al abrirla sigue sonando', async () => {
  const d = dobles();
  d.disco.set('temporizador', JSON.stringify({ fin: d.reloj.ahora - 2 * MIN, titulo: 'Penne', detalle: '', avisoId: null }));

  const { temporizador, sonido } = await arrancar(d);

  await waitFor(() => expect(temporizador.fase()).toBe('sonando'));
  await waitFor(() => expect(sonido.sonando).toBe(true));
});

test('una alarma de hace más de una hora que nadie atendió se descarta en silencio', async () => {
  const d = dobles();
  d.disco.set('temporizador', JSON.stringify({ fin: d.reloj.ahora - 2 * 60 * MIN, titulo: 'Penne', detalle: '', avisoId: null }));

  const { temporizador, sonido } = await arrancar(d);

  await waitFor(() => expect(d.disco.get('temporizador')).toBe('null'));
  expect(temporizador.fase()).toBe('parado');
  expect(sonido.sonando).toBe(false);
});

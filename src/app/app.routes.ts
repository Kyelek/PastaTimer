import type { Routes } from '@angular/router';
import { Cronometro } from './paginas/cronometro/cronometro.ts';
import { Detalle } from './paginas/detalle/detalle.ts';
import { Inicio } from './paginas/inicio/inicio.ts';
import { Marcas } from './paginas/marcas/marcas.ts';
import { Pastas } from './paginas/pastas/pastas.ts';

export const routes: Routes = [
  { path: '', component: Inicio },
  { path: 'cronometro', component: Cronometro },
  { path: 'pastas', component: Pastas },
  { path: 'pastas/:pasta', component: Marcas },
  { path: 'pastas/:pasta/:marca', component: Detalle },
];

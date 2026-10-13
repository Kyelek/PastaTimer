import type { Routes } from '@angular/router';
import { Cronometro } from './paginas/cronometro/cronometro.ts';
import { Inicio } from './paginas/inicio/inicio.ts';
import { Pastas } from './paginas/pastas/pastas.ts';

export const routes: Routes = [
  { path: '', component: Inicio },
  { path: 'cronometro', component: Cronometro },
  { path: 'pastas', component: Pastas },
];

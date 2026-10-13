/**
 * Paleta pastel de la app. Los componentes la leen como variables CSS (`var(--fondo)`), que
 * declara `App` en su `:host` y heredan todas las pantallas. Este objeto es para lo que no lee
 * CSS, como la barra de navegación nativa.
 */
export const colores = {
  fondo: '#fff8ee', // crema
  superficie: '#ffffff',
  borde: '#f1e4d3',
  texto: '#4a3f35',
  textoSuave: '#8a7d70',
  melocoton: '#ffd8be',
  salvia: '#cde5d0',
} as const;

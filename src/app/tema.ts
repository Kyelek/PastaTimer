/**
 * Paleta pastel de la app. Los componentes la leen como variables CSS (`var(--fondo)`), que
 * declara `App` en su `:host` y heredan todas las pantallas. Este objeto es para lo que no lee
 * CSS, como la barra de navegación nativa.
 */
export const colores = {
  fondo: '#f9ecd8', // trigo claro
  superficie: '#ffffff',
  borde: '#ecd9bf',
  texto: '#4a3f35',
  textoSuave: '#8a7d70',
  melocoton: '#ffcfae',
  salvia: '#c7e3cb',
} as const;

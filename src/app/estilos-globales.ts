import { Component } from '@angular/core';

/**
 * Hoja de estilos global: la única que se aplica a los nodos de todos los componentes. Declara las
 * fuentes (de tipo libro de recetas) y pone Lora en todos los textos. Los títulos usan
 * `font-family: 'Playfair Display'` en su propio componente.
 *
 * No se renderiza nunca: `main.ts` solo lee su hoja con `styleSheetOf(EstilosGlobales)`.
 */
@Component({
  selector: 'app-estilos-globales',
  template: '',
  styles: `
    @font-face {
      font-family: 'Playfair Display';
      src: url('../../assets/fuentes/PlayfairDisplay_700Bold.ttf');
      font-weight: 700;
    }
    @font-face {
      font-family: Lora;
      src: url('../../assets/fuentes/Lora_400Regular.ttf');
    }
    @font-face {
      font-family: Lora;
      src: url('../../assets/fuentes/Lora_600SemiBold.ttf');
      font-weight: 600;
    }
    text {
      font-family: Lora;
    }
  `,
})
export class EstilosGlobales {}

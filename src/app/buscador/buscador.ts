import { Component, input, model, signal } from '@angular/core';
import { Pressable, Text, TextInput, View } from '@ng-native/components';

/** Caja de búsqueda centrada que va encima de una lista. */
@Component({
  imports: [Pressable, Text, TextInput, View],
  selector: 'app-buscador',
  template: `
    <view class="caja">
      <text class="lupa">🔍</text>
      <text-input
        class="campo"
        [placeholder]="enfocado() ? '' : placeholder()"
        [accessibilityLabel]="placeholder()"
        [(value)]="consulta"
        (focus)="enfocado.set(true)"
        (blur)="enfocado.set(false)"
        autoCorrect="false"
        returnKeyType="search"
      />
      <!-- Mismo ancho que la lupa, haya o no botón, para que el texto quede centrado de verdad. -->
      <view class="lado">
        @if (consulta()) {
          <pressable
            accessibilityRole="button"
            accessibilityLabel="Borrar búsqueda"
            class="borrar"
            (press)="consulta.set('')"
          >
            <text class="x">✕</text>
          </pressable>
        }
      </view>
    </view>
  `,
  styles: `
    :host {
      align-items: center;
      padding: 16px 16px 4px;
      background-color: var(--fondo);
    }
    .caja {
      width: 100%;
      max-width: 480px;
      flex-direction: row;
      align-items: center;
      gap: 8px;
      padding: 0 14px;
      border-radius: 24px;
      background-color: var(--superficie);
      border-width: 1px;
      border-color: var(--borde);
    }
    .lupa,
    .lado {
      width: 24px;
      align-items: center;
    }
    .lupa {
      font-size: 16px;
      text-align: center;
    }
    .campo {
      flex: 1;
      padding: 12px 0;
      color: var(--texto);
      font-family: Lora;
      font-size: 16px;
      text-align: center;
    }
    .borrar {
      padding: 6px 0;
    }
    .x {
      color: var(--texto-suave);
      font-size: 16px;
    }
  `,
})
export class Buscador {
  readonly consulta = model('');
  readonly placeholder = input('Buscar');

  /**
   * Mientras se escribe se quita el placeholder: Android pone el cursor de un campo centrado al
   * final del placeholder, no en el centro.
   */
  protected readonly enfocado = signal(false);
}

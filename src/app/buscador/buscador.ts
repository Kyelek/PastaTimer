import { Component, input, model } from '@angular/core';
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
        [placeholder]="placeholder()"
        [accessibilityLabel]="placeholder()"
        [(value)]="consulta"
        autoCorrect="false"
        returnKeyType="search"
      />
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
    .lupa {
      font-size: 16px;
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
      padding: 6px;
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
}

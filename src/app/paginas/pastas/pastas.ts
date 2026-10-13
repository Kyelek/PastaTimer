import { Component } from '@angular/core';
import { Pressable, ScrollView, Text, View } from '@ng-native/components';
import { NativeHeader, NativeRouterLink } from '@ng-native/router';
import { opcionesDe, pastas } from '../../catalogo.ts';

/** Listado de tipos de pasta. Al elegir uno se pasa a elegir la marca. */
@Component({
  imports: [NativeHeader, NativeRouterLink, Pressable, ScrollView, Text, View],
  selector: 'app-pastas',
  host: { style: 'flex: 1' },
  template: `
    <native-header title="Tipos de pasta" />
    <scroll-view class="pantalla" contentInsetAdjustmentBehavior="automatic">
      <view class="lista">
        @for (pasta of pastas; track pasta.id) {
          <pressable
            accessibilityRole="button"
            [accessibilityLabel]="pasta.nombre"
            class="fila"
            [nativeRouterLink]="['/pastas', pasta.id]"
          >
            <!-- Hueco para la imagen de la pasta (siguiente tarea). -->
            <view class="imagen"><text class="icono">🍝</text></view>
            <view class="textos">
              <text class="nombre">{{ pasta.nombre }}</text>
              <text class="detalle">{{ marcasDe(pasta) }}</text>
            </view>
            <text class="flecha">›</text>
          </pressable>
        }
      </view>
    </scroll-view>
  `,
  styles: `
    .pantalla {
      flex: 1;
      background-color: var(--fondo);
    }
    .lista {
      gap: 12px;
      padding: 16px;
    }
    .fila {
      flex-direction: row;
      align-items: center;
      gap: 14px;
      padding: 12px;
      border-radius: 18px;
      background-color: var(--superficie);
      border-width: 1px;
      border-color: var(--borde);
    }
    .fila:active {
      opacity: 0.7;
    }
    .imagen {
      width: 56px;
      height: 56px;
      align-items: center;
      justify-content: center;
      border-radius: 14px;
      background-color: var(--melocoton);
    }
    .icono {
      font-size: 28px;
    }
    .textos {
      flex: 1;
      gap: 2px;
    }
    .nombre {
      color: var(--texto);
      font-family: 'Playfair Display';
      font-size: 18px;
      font-weight: 700;
    }
    .detalle {
      color: var(--texto-suave);
      font-size: 13px;
    }
    .flecha {
      color: var(--texto-suave);
      font-size: 28px;
    }
  `,
})
export class Pastas {
  protected readonly pastas = pastas;

  protected marcasDe(pasta: (typeof pastas)[number]): string {
    const total = opcionesDe(pasta).length;
    return total === 1 ? '1 marca' : `${total} marcas`;
  }
}

import { Component, computed, inject, signal } from '@angular/core';
import { Image, Pressable, ScrollView, Text, View } from '@ng-native/components';
import { SafeArea } from '@ng-native/device';
import { NativeHeader, NativeRouterLink } from '@ng-native/router';
import { Buscador } from '../../buscador/buscador.ts';
import { coincide, opcionesDe, pastas } from '../../catalogo.ts';
import { imagenDe } from '../../imagenes.ts';

/** Listado de tipos de pasta. Al elegir uno se pasa a elegir la marca. */
@Component({
  imports: [Buscador, Image, NativeHeader, NativeRouterLink, Pressable, ScrollView, Text, View],
  selector: 'app-pastas',
  host: { style: 'flex: 1' },
  template: `
    <native-header title="Tipos de pasta" />
    <app-buscador placeholder="Buscar pasta" [(consulta)]="consulta" />
    <scroll-view class="pantalla" keyboardShouldPersistTaps="handled">
      <view class="lista" [style.paddingBottom]="zonaSegura.insets().bottom + 24">
        @for (pasta of visibles(); track pasta.id) {
          <pressable
            accessibilityRole="button"
            [accessibilityLabel]="pasta.nombre"
            class="fila"
            [nativeRouterLink]="['/pastas', pasta.id]"
          >
            <view class="marco">
              <image class="imagen" [source]="imagenDe(pasta.id)" resizeMode="contain" />
            </view>
            <view class="textos">
              <text class="nombre">{{ pasta.nombre }}</text>
              <text class="detalle">{{ marcasDe(pasta) }}</text>
            </view>
            <text class="flecha">›</text>
          </pressable>
        } @empty {
          <text class="vacio">Ninguna pasta coincide con «{{ consulta() }}».</text>
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
    .marco {
      width: 64px;
      height: 64px;
      align-items: center;
      justify-content: center;
      border-radius: 16px;
      background-color: var(--fondo);
    }
    .imagen {
      width: 56px;
      height: 56px;
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
    .vacio {
      padding: 24px;
      color: var(--texto-suave);
      font-size: 15px;
      text-align: center;
    }
    .flecha {
      color: var(--texto-suave);
      font-size: 28px;
    }
  `,
})
export class Pastas {
  /** Hueco de la barra de botones de Android abajo, para que el último elemento no quede tapado. */
  protected readonly zonaSegura = inject(SafeArea);

  protected readonly imagenDe = imagenDe;
  protected readonly consulta = signal('');
  protected readonly visibles = computed(() =>
    pastas.filter((pasta) => coincide(pasta.nombre, this.consulta())),
  );

  protected marcasDe(pasta: (typeof pastas)[number]): string {
    const total = opcionesDe(pasta).length;
    return total === 1 ? '1 marca' : `${total} marcas`;
  }
}

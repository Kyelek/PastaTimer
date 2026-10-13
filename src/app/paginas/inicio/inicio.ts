import { Component } from '@angular/core';
import { Pressable, SafeAreaView, Text, View } from '@ng-native/components';
import { NativeRouterLink } from '@ng-native/router';

/** Pantalla principal: acceso directo al cronómetro libre o al listado de pastas. */
@Component({
  imports: [NativeRouterLink, Pressable, SafeAreaView, Text, View],
  selector: 'app-inicio',
  host: { style: 'flex: 1' },
  template: `
    <safe-area-view class="pantalla">
      <view class="cabecera">
        <text class="titulo">Tiempos para pasta</text>
        <text class="subtitulo">¿Qué vamos a cocinar hoy?</text>
      </view>

      <view class="opciones">
        <pressable
          accessibilityRole="button"
          accessibilityLabel="Cronómetro"
          class="opcion cronometro"
          nativeRouterLink="/cronometro"
        >
          <text class="icono">⏱️</text>
          <text class="nombre">Cronómetro</text>
          <text class="detalle">Temporizador libre</text>
        </pressable>

        <pressable
          accessibilityRole="button"
          accessibilityLabel="Pasta"
          class="opcion pasta"
          nativeRouterLink="/pastas"
        >
          <text class="icono">🍝</text>
          <text class="nombre">Pasta</text>
          <text class="detalle">Elige el tipo y la marca</text>
        </pressable>
      </view>
    </safe-area-view>
  `,
  styles: `
    .pantalla {
      flex: 1;
      background-color: var(--fondo);
      padding: 24px;
    }
    .cabecera {
      margin-top: 48px;
      margin-bottom: 40px;
      align-items: center;
      gap: 8px;
    }
    .titulo {
      color: var(--texto);
      font-size: 30px;
      font-weight: 700;
    }
    .subtitulo {
      color: var(--texto-suave);
      font-size: 16px;
    }
    .opciones {
      gap: 20px;
    }
    .opcion {
      align-items: center;
      gap: 6px;
      padding: 28px;
      border-radius: 24px;
      border-width: 1px;
      border-color: var(--borde);
    }
    .opcion:active {
      opacity: 0.7;
    }
    .cronometro {
      background-color: var(--salvia);
    }
    .pasta {
      background-color: var(--melocoton);
    }
    .icono {
      font-size: 40px;
    }
    .nombre {
      color: var(--texto);
      font-size: 22px;
      font-weight: 700;
    }
    .detalle {
      color: var(--texto-suave);
      font-size: 14px;
    }
  `,
})
export class Inicio {}

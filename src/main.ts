// Expo's runtime: its fetch, whose response streams a body, and URL, TextDecoderStream and
// structuredClone. Metro runs it before this file only when something imports it, and nothing
// else does in a release build, which would then get React Native's fetch, with no body.
import 'expo';
import { AppRegistry, Image, Platform, processColor } from 'react-native';
import { mount } from '@ng-native/platform';
import { currentConditions, deviceTokens, watchConditions } from '@ng-native/device';
import { getFabricUIManager, registerPlatformComponents, styleSheetOf } from '@ng-native/fabric';
import { loadFonts } from '@ng-native/expo/fonts';
import { appProviders } from './app/app.config.ts';
import { App } from './app/app.ts';
import { EstilosGlobales } from './app/estilos-globales.ts';

registerPlatformComponents(Platform.OS);

const estilosGlobales = styleSheetOf(EstilosGlobales);

AppRegistry.registerRunnable('main', ({ rootTag }: { rootTag: number | string }) => {
  // Registra las fuentes. No hace falta esperar: el texto se redibuja al cargar cada una.
  void loadFonts(estilosGlobales).catch((error: unknown) => console.error(error));

  const app = mount(Number(rootTag), App, getFabricUIManager(), {
    providers: appProviders,
    globalStyles: estilosGlobales,
    // Colours, as the integers the platform wants.
    processColor,
    // What `@media` resolves against. Without it every media query is false and a responsive
    // layout renders as its smallest case.
    conditions: currentConditions(),
    // Values only the device knows - the hairline width, which is a third of a point on a 3x
    // screen. Without it `1px` is what you get, and that is a visibly fat divider.
    tokens: deviceTokens(),
    // Turns a `require('./x.png')` into something native can load. Without it images are blank.
    resolveAssetSource: (value) => Image.resolveAssetSource(value as never),
  });

  // Re-resolves the conditions when the device rotates or the theme changes. A rotation dirties
  // no component and no binding, so without this nothing re-renders and `dark:` stops following
  // the system switch.
  watchConditions(app.engine);
});

import type { ImageSource } from '@ng-native/components';

/**
 * Imagen de cada pasta, por su `id` de `pastas.json`. Metro solo empaqueta las imágenes que ve en
 * un `require()` con la ruta escrita tal cual, así que una pasta nueva necesita su línea aquí.
 */
const imagenes: Readonly<Record<string, ImageSource>> = {
  espaguetis: require('../../assets/images/espaguetis.png'),
  macarrones: require('../../assets/images/macarrones.png'),
  tallarines: require('../../assets/images/tallarines.png'),
  penne: require('../../assets/images/penne.png'),
  fusilli: require('../../assets/images/fusilli.png'),
  farfalle: require('../../assets/images/farfalle.png'),
  tortellini: require('../../assets/images/tortellini.png'),
  fideos_n1: require('../../assets/images/fideos_n1.png'),
  fideos_n2: require('../../assets/images/fideos_n2.png'),
  rigatoni: require('../../assets/images/rigatoni.png'),
};

export function imagenDe(id: string): ImageSource | undefined {
  return imagenes[id];
}

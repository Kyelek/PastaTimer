import datos from './pastas.json';

/** Minutos de cocción de una pasta en una marca, para cada punto. */
export interface Tiempos {
  readonly al_dente: number;
  readonly suave: number;
  readonly salsa: number;
  readonly nota?: string;
}

export interface Pasta {
  readonly id: string;
  readonly nombre: string;
  readonly imagen: string;
  /** Por nombre de marca; `null` cuando la marca no vende esta pasta. */
  readonly tiempos: Readonly<Record<string, Tiempos | null>>;
}

export interface Marca {
  /** Para la URL: "Hacendado (Mercadona)" pasa a "hacendado-mercadona". */
  readonly id: string;
  readonly nombre: string;
}

/** Una marca que vende cierta pasta, con sus tiempos. */
export interface Opcion {
  readonly marca: Marca;
  readonly tiempos: Tiempos;
}

/** En minúsculas y sin tildes, para comparar textos. */
function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
}

function aId(nombre: string): string {
  return normalizar(nombre)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Si `texto` contiene lo buscado, sin distinguir mayúsculas ni tildes. Vacío coincide con todo. */
export function coincide(texto: string, consulta: string): boolean {
  return normalizar(texto).includes(normalizar(consulta.trim()));
}

export const marcas: readonly Marca[] = datos.marcas.map((nombre) => ({ id: aId(nombre), nombre }));

export const pastas: readonly Pasta[] = datos.pastas as Pasta[];

export function pastaPorId(id: string): Pasta | undefined {
  return pastas.find((pasta) => pasta.id === id);
}

export function marcaPorId(id: string): Marca | undefined {
  return marcas.find((marca) => marca.id === id);
}

/** Las marcas que venden la pasta, en el orden de `marcas`. */
export function opcionesDe(pasta: Pasta): Opcion[] {
  return marcas.flatMap((marca) => {
    const tiempos = pasta.tiempos[marca.nombre];
    return tiempos ? [{ marca, tiempos }] : [];
  });
}

/** Los tres puntos de cocción, en el orden en que se muestran. */
export const puntos = [
  { clave: 'al_dente', nombre: 'Al dente' },
  { clave: 'suave', nombre: 'Suave' },
  { clave: 'salsa', nombre: 'Terminar en salsa' },
] as const satisfies readonly { clave: keyof Tiempos; nombre: string }[];

export type Punto = (typeof puntos)[number];

function esFresca(tiempos: Tiempos): boolean {
  return /fresca/i.test(tiempos.nota ?? '');
}

/** Pasos breves para preparar el agua y cocer la pasta, según el tipo y la marca. */
export function instruccionesDe(pasta: Pasta, tiempos: Tiempos): string[] {
  const pasos = [
    'Pon a hervir abundante agua: 1 litro por cada 100 g de pasta.',
    'Cuando hierva a borbotones, añade la sal: unos 10 g (una cucharada rasa) por litro.',
    'Echa la pasta, remueve el primer minuto para que no se pegue y pon el temporizador.',
  ];
  if (pasta.id.startsWith('fideos')) {
    pasos.push('Para sopa, cuécelos directamente en el caldo y prueba de sal antes de añadirla.');
  }
  if (esFresca(tiempos)) {
    pasos.push('Es pasta fresca: se hace en pocos minutos, no te alejes del fuego.');
  }
  if (pasta.id === 'tortellini') {
    pasos.push('Remueve con suavidad para que no se abran.');
  }
  pasos.push(
    `«Terminar en salsa»: escúrrela ${tiempos.al_dente - tiempos.salsa} min antes y acaba la cocción en la sartén con la salsa y un poco del agua de cocción.`,
  );
  return pasos;
}

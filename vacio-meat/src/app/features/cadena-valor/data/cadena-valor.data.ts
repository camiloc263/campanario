export type IconoCadena = 'granja' | 'escudo' | 'camion' | 'paquete' | 'tienda';

export interface PilarOperativo {
  id: string;
  titulo: string;
  subtitulo: string;
  indicador: string;
  detalle: string;
  icono: IconoCadena;
  imagen?: string;        // ruta en public/ (si no existe, se muestra el ícono)
  alt: string;
}

export interface EtapaCadena {
  id: string;
  numero: string;
  titulo: string;
  descripcion: string;
  detalleAmpliado: string;
  beneficios: string[];
  icono: IconoCadena;
  imagen?: string;
  alt: string;
}

export interface SelloGarantia {
  texto: string;
  descripcion: string;
}

export const CABECERA = {
  kicker: 'Carne de cerdo 100% colombiana · Del campo a tu mesa',
  titulo: 'Calidad, frescura y confianza en cada corte',
  lema: '“¡El mejor sabor en su mesa!”',
  subtituloCadena: 'Trazabilidad completa',
  tituloCadena: 'Nuestra cadena de valor',
  ayudaCadena: 'Selecciona una etapa para conocer sus estándares',
};

export const PILARES: PilarOperativo[] = [
  {
    id: 'granja',
    titulo: 'Nuestra granja',
    subtitulo: 'Bienestar animal, producción responsable',
    indicador: 'Pilar 01 · Origen y crianza',
    detalle:
      'Crianza tecnificada en entornos limpios con alimentación balanceada y protocolos estrictos de bioseguridad y bienestar animal.',
    icono: 'granja',
    imagen: 'images/cadena/granja.jpg',
    alt: 'Instalaciones de la granja porcícola',
  },
  {
    id: 'planta',
    titulo: 'Planta de procesamiento',
    subtitulo: 'Procesos seguros y con altos estándares',
    indicador: 'Pilar 02 · Inocuidad y corte',
    detalle:
      'Desposte higiénico y sellado hermético al vacío bajo temperatura controlada para conservar intactos los nutrientes y la jugosidad.',
    icono: 'escudo',
    imagen: 'images/cadena/planta.jpg',
    alt: 'Planta de procesamiento y desposte',
  },
  {
    id: 'distribucion',
    titulo: 'Distribución',
    subtitulo: 'Llevamos calidad a tu hogar',
    indicador: 'Pilar 03 · Cadena de frío',
    detalle:
      'Entregas directas y programadas sin intermediarios, manteniendo cadena de frío continua desde la planta hasta su mesa.',
    icono: 'camion',
    imagen: 'images/cadena/distribucion.jpg',
    alt: 'Distribución directa de carne empacada',
  },
];

export const ETAPAS: EtapaCadena[] = [
  {
    id: 'produccion',
    numero: '01',
    titulo: 'Producción porcina',
    descripcion: 'Cuidado, alimentación y salud para nuestros cerdos',
    detalleAmpliado:
      'Nuestros ejemplares crecen bajo supervisión permanente, nutrición formulada por etapas y manejo ambiental sostenible con aprovechamiento circular de residuos.',
    beneficios: [
      'Genética seleccionada para cortes magros y tiernos',
      'Control sanitario preventivo y bioseguridad constante',
      'Manejo ambiental responsable y economía circular',
    ],
    icono: 'granja',
    imagen: 'images/cadena/produccion.jpg',
    alt: 'Producción porcina con bienestar animal',
  },
  {
    id: 'beneficio',
    numero: '02',
    titulo: 'Planta de beneficio',
    descripcion: 'Procesos higiénicos y control de calidad',
    detalleAmpliado:
      'Cumplimos rigurosos estándares sanitarios en cada fase de transformación, garantizando trazabilidad completa y manipulación inocua de cada pieza.',
    beneficios: [
      'Protocolos estrictos de higiene y desinfección',
      'Inspección y trazabilidad por lote de producción',
      'Personal capacitado en buenas prácticas de manufactura',
    ],
    icono: 'escudo',
    imagen: 'images/cadena/beneficio.jpg',
    alt: 'Planta de beneficio y control de calidad',
  },
  {
    id: 'empaque',
    numero: '03',
    titulo: 'Empaque al vacío',
    descripcion: 'Mayor frescura y mayor vida útil',
    detalleAmpliado:
      'El sellado al vacío en bolsas de alta barrera protege la carne del oxígeno y agentes externos, prolongando su vida útil en refrigeración sin conservantes artificiales.',
    beneficios: [
      'Conserva el color rosado natural, textura y jugosidad',
      'Porcionado práctico listo para cocinar o almacenar',
      'Cero conservantes químicos añadidos',
    ],
    icono: 'paquete',
    imagen: 'images/cadena/empaque.jpg',
    alt: 'Cortes de carne empacados al vacío',
  },
  {
    id: 'punto-venta',
    numero: '04',
    titulo: 'Punto de venta',
    descripcion: 'Carne de calidad para su familia',
    detalleAmpliado:
      'Exhibición en vitrinas refrigeradas de última generación y atención directa para hogares, carnicerías y restaurantes con precios justos del productor.',
    beneficios: [
      'Cadena de frío garantizada hasta el momento de compra',
      'Venta directa sin sobrecostos de intermediación',
      'Disponibilidad constante de cortes magros y especiales',
    ],
    icono: 'tienda',
    imagen: 'images/cadena/punto-venta.jpg',
    alt: 'Punto de venta de carne de cerdo',
  },
];

export const SELLOS: SelloGarantia[] = [
  { texto: 'Inocuidad alimentaria', descripcion: 'Control sanitario en toda la cadena.' },
  { texto: 'Calidad garantizada', descripcion: 'Cortes seleccionados, tiernos y frescos.' },
  { texto: 'Producción sostenible', descripcion: 'Cero desperdicios y respeto ambiental.' },
  { texto: 'Bienestar para su familia', descripcion: 'Nutrición confiable directa del campo.' },
];

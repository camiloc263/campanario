export type IconoCompetidor = 'tienda' | 'edificio' | 'ruta';
export type TonoBrecha = 'rojo' | 'ambar' | 'neutro';
export type TipoCelda = 'si' | 'no' | 'neutro';
export type IconoPilar = 'escudo' | 'ciclo' | 'personas';

export interface Brecha { texto: string; tono: TonoBrecha; }

export interface Competidor {
  numero: number;
  nombre: string;
  icono: IconoCompetidor;
  precio: string;           // texto tal como aparece en el plan
  precioMin: number;        // para el gráfico de rango (COP por libra)
  precioMax: number;
  caracteristicas: string;
  brechas: Brecha[];
}

export interface CeldaMatriz { tipo: TipoCelda; texto: string; }

export interface FilaMatriz {
  actor: string;
  propia?: boolean;         // resalta la fila de la granja
  precio: CeldaMatriz;
  vacio: CeldaMatriz;
  canal: CeldaMatriz;
  circular: CeldaMatriz;
}

export interface Pilar { icono: IconoPilar; etiqueta: string; titulo: string; texto: string; }

export const CABECERA = {
  titulo: 'Competencia y diferenciación',
  descripcion:
    'Análisis competitivo y propuesta de valor diferencial en el mercado cárnico de Linares, Nariño.',
  etiquetaModo: 'Modo de exploración comparativa:',
  tarjetas: 'Vista de tarjetas',
  matriz: 'Matriz comparativa',
};

/** Escala del gráfico de rango de precios (COP por libra). */
export const ESCALA_PRECIO = { min: 10000, max: 14000 };

export const COMPETIDORES: Competidor[] = [
  {
    numero: 1,
    nombre: 'Comercializadoras tradicionales locales',
    icono: 'tienda',
    precio: 'Variable según intermediario ($10.500 – $12.000 por libra a granel).',
    precioMin: 10500,
    precioMax: 12000,
    caracteristicas:
      'Venta de carne de cerdo a granel en plazas de mercado o expendios locales; dependencia de intermediarios y sin trazabilidad clara sobre el manejo sanitario en granja.',
    brechas: [
      { texto: 'Sin trazabilidad', tono: 'rojo' },
      { texto: 'Intermediarios', tono: 'neutro' },
    ],
  },
  {
    numero: 2,
    nombre: 'Expendios y carnicerías municipales',
    icono: 'edificio',
    precio: '$11.000 – $13.000 por libra.',
    precioMin: 11000,
    precioMax: 13000,
    caracteristicas:
      'Ofrecen cortes cárnicos convencionales con puntos de venta físicos en el municipio, pero el producto se comercializa fresco sin empaque hermético, lo que reduce su vida útil en refrigeración y aumenta el riesgo de contaminación cruzada.',
    brechas: [
      { texto: 'Sin empaque hermético', tono: 'ambar' },
      { texto: 'Menor vida útil', tono: 'neutro' },
    ],
  },
  {
    numero: 3,
    nombre: 'Proveedores de carne de municipios vecinos',
    icono: 'ruta',
    precio: '$11.500 – $13.500 por libra.',
    precioMin: 11500,
    precioMax: 13500,
    caracteristicas:
      'Introducen carne porcina empacada desde otras localidades a Linares, generando mayores costos de transporte y precios menos competitivos para el consumidor local.',
    brechas: [
      { texto: 'Sobrecosto por flete', tono: 'rojo' },
      { texto: 'Producto foráneo', tono: 'neutro' },
    ],
  },
];

export const COLUMNAS_MATRIZ = [
  'Actor del mercado',
  'Precio / libra',
  'Empaque al vacío',
  'Canal directo',
  'Economía circular',
];

export const TITULO_MATRIZ = {
  titulo: 'Matriz comparativa en Linares, Nariño',
  subtitulo: 'Comparación por atributos clave',
};

export const FILAS_MATRIZ: FilaMatriz[] = [
  {
    actor: 'Granja Porcícola El Campanario',
    propia: true,
    precio: { tipo: 'si', texto: 'Competitivo directo' },
    vacio: { tipo: 'si', texto: 'Sí (sin conservantes)' },
    canal: { tipo: 'si', texto: 'Directo (Jhojan Portilla)' },
    circular: { tipo: 'si', texto: 'Compostaje integral' },
  },
  {
    actor: '1. Comercializadoras tradicionales locales',
    precio: { tipo: 'neutro', texto: '$10.500 – $12.000 (granel)' },
    vacio: { tipo: 'no', texto: 'No (a granel)' },
    canal: { tipo: 'no', texto: 'Intermediarios' },
    circular: { tipo: 'no', texto: 'Sin trazabilidad' },
  },
  {
    actor: '2. Expendios y carnicerías municipales',
    precio: { tipo: 'neutro', texto: '$11.000 – $13.000' },
    vacio: { tipo: 'no', texto: 'Sin empaque hermético' },
    canal: { tipo: 'neutro', texto: 'Punto físico local' },
    circular: { tipo: 'no', texto: 'Convencional' },
  },
  {
    actor: '3. Proveedores de municipios vecinos',
    precio: { tipo: 'neutro', texto: '$11.500 – $13.500' },
    vacio: { tipo: 'neutro', texto: 'Empaque externo' },
    canal: { tipo: 'no', texto: 'Mayores costos de transporte' },
    circular: { tipo: 'no', texto: 'Producción foránea' },
  },
];

export const DIFERENCIAL = {
  insignia: 'Propuesta de valor diferencial',
  titulo: 'Diferencial de la Granja Porcícola El Campanario',
  texto:
    'Además de ofrecer carne de cerdo fresca y magra de la más alta calidad, implementa tecnología de empacado al vacío para garantizar una mayor vida útil e higiene superior sin conservantes, un modelo de economía circular (aprovechamiento de residuos para compostaje) y comercialización directa sin intermediarios desde la granja de Jhojan Portilla hasta los hogares y comercios de Linares.',
  pilares: [
    {
      icono: 'escudo',
      etiqueta: 'Higiene superior',
      titulo: 'Empacado al vacío sin conservantes',
      texto: 'Mayor vida útil en refrigeración y máxima frescura en cortes magros seleccionados.',
    },
    {
      icono: 'ciclo',
      etiqueta: 'Sostenibilidad',
      titulo: 'Economía circular (compostaje)',
      texto: 'Aprovechamiento responsable de residuos en granja para producción de compostaje limpio.',
    },
    {
      icono: 'personas',
      etiqueta: 'Canal directo',
      titulo: 'Venta directa sin intermediarios',
      texto: 'Desde la granja de Jhonjan Portilla directamente hasta los hogares y comercios de Linares.',
    },
  ] as Pilar[],
};

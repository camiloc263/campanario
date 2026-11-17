import { FichaItem } from './ficha.model';

/** Producto destacado (panel izquierdo). */
export const PRINCIPAL: FichaItem = {
  id: 'cortes-magros',
  categoria: 'producto',
  etiqueta: 'Producto',
  icono: 'vacio',
  imagen: 'images/productos/producto-lomo.jpg',
  titulo: 'Cortes magros y empacados al vacío',
  resumen:
    'Carne fresca de cerdo seleccionada, empacada al vacío con rigurosos estándares de inocuidad y presentación profesional.',
  texto:
    'Carne fresca seleccionada de cerdo (lomo, pierna y pulpa), empacada al vacío bajo rigurosos estándares de inocuidad, lo que prolonga su vida útil de forma natural, preserva sus propiedades organolépticas, evita contaminación cruzada y ofrece una presentación limpia y profesional para el consumidor final.',
  etiquetas: ['Lomo', 'Pierna', 'Pulpa'],
  lista: [
    'Vida útil prolongada de forma natural',
    'Conserva sus propiedades organolépticas',
    'Evita la contaminación cruzada',
    'Presentación limpia y profesional',
  ],
  tituloLista: 'Ventajas',
  cotizable: true,
};

/** Tarjetas del carrusel (panel derecho). */
export const COMPLEMENTOS: FichaItem[] = [
  {
    id: 'cortes-especiales',
    categoria: 'producto',
    etiqueta: 'Producto',
    icono: 'parrilla',
    imagen: 'images/productos/producto-chuletas.jpg',
    titulo: 'Cortes especiales y para asar',
    resumen: 'Costilla, chuleta y tocino carnudo también en presentación empacada al vacío.',
    texto:
      'Cortes preferidos (costilla, chuleta y tocino carnudo) también disponibles en presentación empacada al vacío, garantizando mayor frescura y comodidad para las 20 familias vinculadas, carnicerías aliadas y establecimientos gastronómicos de la región.',
    etiquetas: ['Costilla', 'Chuleta', 'Tocino carnudo'],
    cotizable: true,
  },
  {
    id: 'servicio-adicional',
    categoria: 'servicio',
    etiqueta: 'Servicio',
    icono: 'camion',
    titulo: 'Servicio adicional',
    resumen: 'Distribución directa desde la granja en Linares con trazabilidad garantizada.',
    texto:
      'Distribución directa desde la granja en Linares con trazabilidad garantizada, asegurando que el sellado al vacío conserve la calidad óptima del producto durante el transporte y almacenamiento en frío.',
    etiquetas: ['Distribución directa', 'Trazabilidad', 'Cadena de frío'],
    cotizable: true,
  },
  {
    id: 'innovacion',
    categoria: 'innovacion',
    etiqueta: 'Innovación',
    icono: 'hoja',
    titulo: 'Innovación',
    resumen: 'Empaque al vacío, economía circular y comercialización directa por canales digitales.',
    texto:
      'Implementación de tecnología de empaque al vacío combinada con un modelo de economía circular (aprovechamiento de residuos de cocheras para compostaje) y comercialización directa mediante canales digitales, eliminando intermediarios y elevando los estándares de comercialización pecuaria en la zona rural.',
    etiquetas: ['Empaque al vacío', 'Economía circular', 'Canales digitales'],
    cotizable: false,
  },
  {
    id: 'equipos',
    categoria: 'equipos',
    etiqueta: 'Ficha técnica',
    icono: 'equipos',
    titulo: 'Equipos y elementos proyectados',
    resumen: 'Empacadora industrial, báscula de precisión, refrigeración, vitrina y punto de venta (POS).',
    texto:
      'Máquina empacadora al vacío industrial, báscula digital de precisión, refrigeradores y congeladores industriales para conservación de carnes, vitrina exhibidora para puntos de venta, herramientas menores de corte y empaque, computador, impresora y sistema de punto de venta (POS).',
    etiquetas: ['Empacadora industrial', 'Báscula de precisión', 'Punto de venta (POS)'],
    lista: [
      'Máquina empacadora al vacío industrial',
      'Báscula digital de precisión',
      'Refrigeradores y congeladores industriales para conservación de carnes',
      'Vitrina exhibidora para puntos de venta',
      'Herramientas menores de corte y empaque',
      'Computador',
      'Impresora',
      'Sistema de punto de venta (POS)',
    ],
    tituloLista: 'Incluye',
    cotizable: false,
  },
];

export type IconoCanal = 'camion' | 'paquete' | 'tienda' | 'etiqueta';

export interface PasoValidacion {
  rotulo: string;
  texto: string;
  resaltar?: string;       // fragmento de `texto` que se muestra en negrilla
}

export interface Canal {
  rotulo: string;
  texto: string;
  icono: IconoCanal;
}

export const CABECERA = {
  titulo: 'Validación del producto y comercialización',
  nota: 'Punto 8 del plan de negocios',      // deja '' para ocultar la etiqueta
};

export const TITULOS = {
  validacion: 'Estado de validación',
  canales: '¿Cómo se comercializará?',
};

/** Número que se anima en la columna de validación. */
export const FAMILIAS_VINCULADAS = 20;

export const FOTOS = {
  paisaje: { src: 'images/historia/paisaje-linares.png', alt: 'Paisaje rural de Linares, Nariño' },
  empaques: { src: 'images/historia/nosotros.png', alt: 'Cortes de cerdo empacados al vacío sobre una tabla de madera' },
};

export const PASOS: PasoValidacion[] = [
  {
    rotulo: 'Trayectoria previa',
    texto: 'Grupo asociativo con experiencia en cría y venta local de carne de cerdo en Linares.',
  },
  {
    rotulo: 'Alta demanda',
    texto: 'Cortes frescos y magros validados en la comunidad.',
  },
  {
    rotulo: 'Sondeos y acuerdos',
    texto: 'Aplicados con más de 20 familias vinculadas, carnicerías y establecimientos locales.',
  },
  {
    rotulo: 'Nuevo formato',
    texto: 'Validación de aceptación del formato EMPACADO AL VACÍO y entregas periódicas directas.',
    resaltar: 'EMPACADO AL VACÍO',
  },
];

export const CANALES: Canal[] = [
  {
    rotulo: 'Venta directa y entregas programadas',
    texto: 'Abastecimiento constante a familias y hogares.',
    icono: 'camion',
  },
  {
    rotulo: 'Domicilios y pedidos directos',
    texto: 'Distribución de cortes magros empacados al vacío.',
    icono: 'paquete',
  },
  {
    rotulo: 'Alianzas comerciales B2B',
    texto: 'Suministro directo al por mayor para carnicerías, tiendas, restaurantes y asaderos.',
    icono: 'tienda',
  },
  {
    rotulo: 'Visibilidad y posicionamiento',
    texto: 'Etiquetado propio (Granja Porcícola El Campanario), tarjetas, pendón, ferias y mercados.',
    icono: 'etiqueta',
  },
];

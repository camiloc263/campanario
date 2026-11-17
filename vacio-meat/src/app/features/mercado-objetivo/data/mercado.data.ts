export type IconoMercado =
  | 'hogar' | 'trabajo' | 'familias' | 'edad'
  | 'tienda' | 'carrito' | 'restaurante' | 'mapa';

export type IdSegmento = 'b2c' | 'b2b';
export type IdFiltro = 'todos' | IdSegmento;

export interface ItemSegmento {
  rotulo: string;
  texto: string;
  icono: IconoMercado;
}

export interface SegmentoMercado {
  id: IdSegmento;
  etiqueta: string;       // insignia superior
  titulo: string;
  descripcion: string;
  items: ItemSegmento[];
}

export const CABECERA = {
  titulo: 'Mercado objetivo o clientes',
  descripcion:
    'Segmentación estratégica de demanda local y regional en Linares, Nariño para carne de cerdo fresca, magra y empacada al vacío.',
  etiquetaFiltros: 'Explorar por segmento:',
};

export const FILTROS: { id: IdFiltro; texto: string }[] = [
  { id: 'todos', texto: 'Todos los segmentos' },
  { id: 'b2c', texto: 'Hogares (B2C)' },
  { id: 'b2b', texto: 'Aliados comerciales (B2B)' },
];

export const SEGMENTOS: SegmentoMercado[] = [
  {
    id: 'b2c',
    etiqueta: 'Consumo directo · Hogares de Linares (B2C)',
    titulo: 'Clientes principales',
    descripcion:
      'Personas aproximadamente entre 18 y 60 años: habitantes del municipio de Linares, Nariño, amas de casa, trabajadores, familias campesinas y las más de 20 familias vinculadas directamente al proyecto que buscan carne de cerdo fresca, magra y empacada al vacío para su consumo semanal en el hogar.',
    items: [
      { rotulo: 'Hogares y amas de casa', texto: 'Consumo familiar', icono: 'hogar' },
      { rotulo: 'Trabajadores', texto: 'Practicidad al vacío', icono: 'trabajo' },
      { rotulo: '+20 familias vinculadas', texto: 'Base asociativa local', icono: 'familias' },
      { rotulo: 'Rango 18 – 60 años', texto: 'Habitantes de Linares y hogares', icono: 'edad' },
    ],
  },
  {
    id: 'b2b',
    etiqueta: 'Alianzas comerciales · Región y gastronomía (B2B)',
    titulo: 'Clientes complementarios',
    descripcion:
      'Habitantes de veredas y municipios cercanos, así como aliados comerciales locales: carnicerías, tiendas de barrio, minimercados y establecimientos gastronómicos (restaurantes, asaderos y casetas) que demandan cortes especiales empacados al vacío y carne en canal con garantía de higiene y suministro constante.',
    items: [
      { rotulo: 'Carnicerías y tiendas', texto: 'Comercio de barrio', icono: 'tienda' },
      { rotulo: 'Minimercados', texto: 'Exhibición refrigerada', icono: 'carrito' },
      { rotulo: 'Restaurantes y asaderos', texto: 'Gastronomía y casetas', icono: 'restaurante' },
      { rotulo: 'Veredas y municipios', texto: 'Expansión cercana', icono: 'mapa' },
    ],
  },
];

export const ESTUDIO = {
  kicker: 'Estudio de mercado local · Linares, Nariño',
  titulo: 'Proceso de recolección de datos',
  texto:
    'Aplicación directa a familias vinculadas, vecinos de Linares, carnicerías y restaurantes de la zona para validar la aceptación del producto y asegurar la colocación comercial.',
  boton: 'Responder la encuesta',
  fragmento: 'encuesta',     // id de la sección de la encuesta
};

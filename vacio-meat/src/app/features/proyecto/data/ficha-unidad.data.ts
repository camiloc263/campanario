export type IconoBloque = 'granja' | 'valor' | 'proceso' | 'higiene';

export interface DatoFicha {
  rotulo?: string;   // etiqueta en negrilla (opcional)
  texto: string;
}

export interface BloqueFicha {
  numero: number;
  titulo: string;
  icono: IconoBloque;
  intro?: string;        // párrafo previo a la lista (opcional)
  ordenado?: boolean;    // true = lista numerada (pasos)
  items: DatoFicha[];
}

export const CABECERA = {
  titulo: 'Ficha técnica de la unidad productiva',
  nombre: 'Granja Porcícola El Campanario',
  ubicacion: 'Linares, Nariño – Colombia',
  eslogan: 'Calidad del campo, frescura garantizada al vacío.',
};

export const BLOQUES: BloqueFicha[] = [
  {
    numero: 1,
    titulo: 'Identificación de la unidad productiva',
    icono: 'granja',
    items: [
      { rotulo: 'Nombre comercial', texto: 'Granja Porcícola El Campanario.' },
      {
        rotulo: 'Tipo de negocio',
        texto: 'Unidad productiva agropecuaria y comercializadora cárnica con enfoque asociativo y de economía circular.',
      },
      {
        rotulo: 'Actividad principal',
        texto: 'Cría, engorde, beneficio y comercialización directa de carne de cerdo fresca, magra y empacada al vacío.',
      },
      { rotulo: 'Ubicación', texto: 'Zona rural / finca en el municipio de Linares, Nariño, Colombia.' },
      {
        rotulo: 'Concepto',
        texto: 'Producción porcícola limpia y tecnificada que conecta directamente al campo con el consumidor local, eliminando intermediarios y garantizando inocuidad y trazabilidad.',
      },
      {
        rotulo: 'Productos y servicios proyectados',
        texto: 'Cortes magros seleccionados (lomo, pierna, pulpa), cortes especiales (costilla, chuleta, tocino carnudo), carne en canal y entregas programadas a hogares y establecimientos comerciales.',
      },
      {
        rotulo: 'Estado actual',
        texto: 'Iniciativa asociativa en etapa de fortalecimiento y estructuración para financiación (Fondo Emprendedor – Economía Popular).',
      },
    ],
  },
  {
    numero: 2,
    titulo: 'Imagen, espacio y propuesta de valor',
    icono: 'valor',
    items: [
      { rotulo: 'Marca del proyecto', texto: 'Granja Porcícola El Campanario.' },
      { rotulo: 'Eslogan', texto: 'Calidad del campo, frescura garantizada al vacío.' },
      {
        rotulo: 'Identidad',
        texto: 'Producción pecuaria campesina, limpia, asociativa y comprometida con la seguridad alimentaria de Linares.',
      },
      {
        rotulo: 'Infraestructura y ambiente',
        texto: 'Predio rural equipado con cocheras bioseguras, áreas de alimentación balanceada, zona de compostaje y área de desposte, porcionado y empacado al vacío.',
      },
      {
        rotulo: 'Espacio proyectado',
        texto: 'Adecuación técnica de instalaciones pecuarias, cuarto frío/congelación y zona de empaque higiénico con maquinaria de sellado al vacío.',
      },
      {
        rotulo: 'Propuesta de valor',
        texto: 'Ofrecer carne de cerdo magra, higiénica y de mayor vida útil gracias al empacado al vacío, producida bajo un modelo sostenible donde nada se desperdicia.',
      },
      {
        rotulo: 'Clientes',
        texto: 'Más de 20 familias vinculadas, hogares del municipio de Linares, carnicerías, tiendas de barrio, restaurantes y asaderos locales.',
      },
    ],
  },
  {
    numero: 3,
    titulo: 'Proceso productivo y atención al cliente',
    icono: 'proceso',
    intro:
      'La Granja Porcícola El Campanario está orientada a abastecer al mercado local con cortes porcinos frescos y seguros, garantizando un trato justo tanto para los productores asociados como para los consumidores finales.',
    ordenado: true,
    items: [
      { texto: 'Cría y engorde de cerdos bajo protocolos estrictos de bioseguridad, bienestar animal y alimentación balanceada.' },
      { texto: 'Beneficio en planta autorizada cumpliendo la normatividad sanitaria vigente (ICA).' },
      { texto: 'Desposte higiénico, porcionado y empacado al vacío para conservar el color, jugosidad y frescura natural de la carne.' },
      { texto: 'Almacenamiento en cadena de frío controlada.' },
      { texto: 'Recepción y confirmación de pedidos mediante canales directos (WhatsApp Business y atención personalizada).' },
      { texto: 'Distribución y entrega directa a domicilios, carnicerías y restaurantes.' },
      { texto: 'Limpieza, desinfección de áreas y aprovechamiento de residuos orgánicos para compostaje.' },
    ],
  },
  {
    numero: 4,
    titulo: 'Condiciones del producto, higiene y diferencial',
    icono: 'higiene',
    items: [
      {
        rotulo: 'Productos',
        texto: 'Cortes magros (lomo, pierna, pulpa), cortes especiales (costilla, chuleta, tocino carnudo) y carne en canal empacados al vacío.',
      },
      {
        rotulo: 'Características sensoriales',
        texto: 'Carne tierna, magra, de color rosado natural, sin olores desagradables y con jugosidad preservada gracias al sellado hermético al vacío.',
      },
      {
        rotulo: 'Materias primas e insumos',
        texto: 'Lechones de genética mejorada, alimento balanceado formulado por etapas, sales minerales, forrajes locales y bolsas de alta barrera para empacado al vacío.',
      },
      {
        rotulo: 'Higiene y bioseguridad',
        texto: 'Aplicación rigurosa de Buenas Prácticas Pecuarias (BPP), desinfección permanente de cocheras, uso de dotación sanitaria y manipulación higiénica en el área de empaque.',
      },
      {
        rotulo: 'Conservación',
        texto: 'Todos los cortes empacados al vacío se mantienen bajo estricta refrigeración y congelación controlada para prolongar su vida útil sin necesidad de conservantes artificiales.',
      },
      {
        rotulo: 'Manejo ambiental (Economía Circular)',
        texto: 'Bajo el principio de “cero desperdicios”, los residuos orgánicos de las cocheras se recolectan y transforman en abono orgánico (compostaje) para fertilizar cultivos de la región, evitando la contaminación del suelo y las fuentes hídricas.',
      },
      {
        rotulo: 'Diferencial',
        texto: 'Integración de producción asociativa limpia, empacado al vacío que eleva la higiene y duración del producto, venta directa sin intermediarios y economía circular.',
      },
      {
        rotulo: 'Nota técnica',
        texto: 'Los protocolos sanitarios, capacidad instalada, rutinas de bioseguridad y precios de comercialización se rigen por la normatividad pecuaria colombiana y los acuerdos internos de la asociación liderada por Orlando Cuaran.',
      },
    ],
  },
];

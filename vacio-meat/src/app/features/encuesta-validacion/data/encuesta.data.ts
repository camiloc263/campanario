export interface OpcionEncuesta {
  valor: string;
  texto: string;
}

export interface PreguntaEncuesta {
  id: string;
  texto: string;
  opciones: OpcionEncuesta[];
}

export const ENCUESTA = {
  titulo: 'Encuesta de validación de mercado',
  intro:
    'Ayúdanos a conocer tus preferencias de consumo para ofrecerte carne de cerdo fresca, magra y empacada al vacío directamente desde nuestra granja hasta la mesa.',
  /**
   * Dirección que recibirá las respuestas por POST (JSON): un Google Apps Script,
   * Formspree, Firebase Function, tu propia API, etc.
   * Si queda vacía, las respuestas solo se muestran en la consola del navegador.
   */
  envioUrl: '',
  claveBorrador: 'encuesta-validacion-el-campanario',
};

export const PREGUNTAS: PreguntaEncuesta[] = [
  {
    id: 'edad',
    texto: '¿Cuál es tu rango de edad?',
    opciones: [
      { valor: '18', texto: 'Menores de 18' },
      { valor: '18-28', texto: '18 - 28' },
      { valor: '29-50', texto: '29 - 50' },
      { valor: '50+', texto: 'Más de 50' },
    ],
  },
  {
    id: 'actividad',
    texto: '¿Cuál es tu actividad específica como comprador?',
    opciones: [
      { valor: 'hogar', texto: 'Hogar / Ama de casa' },
      { valor: 'independiente', texto: 'Independiente / Negocio' },
      { valor: 'tienda', texto: 'Dueño de carnicería o tienda de barrio' },
      { valor: 'restaurante', texto: 'Propietario de restaurante o asadero' },
    ],
  },
  {
    id: 'frecuencia',
    texto: '¿Con qué frecuencia consumes o compras carne de cerdo?',
    opciones: [
      { valor: 'diario', texto: 'Diario' },
      { valor: '1-2 veces', texto: '1 a 2 veces por semana' },
      { valor: 'quincenal', texto: 'Cada 15 días (fines de semana)' },
      { valor: 'ocasional', texto: 'Quincenal o mensual' },
    ],
  },
  {
    id: 'cantidad',
    texto: '¿Qué cantidad promedio de carne de cerdo compras por semana?',
    opciones: [
      { valor: '1-2 libras', texto: '1 a 2 libras' },
      { valor: '3-5 libras', texto: '3 a 5 libras' },
      { valor: '6-10 libras', texto: '6 a 10 libras' },
      { valor: 'mas-10', texto: 'Más de 10 libras (compras al por mayor / B2B)' },
    ],
  },
  {
    id: 'corte',
    texto: '¿Cuál es el corte de cerdo que más prefieres o solicitas?',
    opciones: [
      { valor: 'magros', texto: 'Cortes magros (Lomo, pierna, pulpa)' },
      { valor: 'especiales', texto: 'Cortes especiales para asar (Costilla, chuleta)' },
      { valor: 'tocino', texto: 'Tocino carnudo / Chicharrón' },
      { valor: 'canal', texto: 'Variedad de cortes / Carne en canal' },
    ],
  },
  {
    id: 'valor',
    texto: '¿Qué es lo que más valoras al momento de comprar carne de cerdo?',
    opciones: [
      { valor: 'higiene', texto: 'Higiene, frescura y procedencia garantizada (bioseguridad)' },
      { valor: 'cortes', texto: 'Cortes magros (baja en grasa y frescos)' },
      { valor: 'precio', texto: 'Precio justo sin intermediarios' },
      { valor: 'entrega', texto: 'Entrega a domicilio / disponibilidad constante' },
      { valor: 'todas', texto: 'Todas las anteriores' },
    ],
  },
  {
    id: 'vacio',
    texto:
      '¿Te gustaría adquirir carne de cerdo fresca, porcionada y empacada al vacío para mejor higiene y duración en la nevera?',
    opciones: [
      { valor: 'si', texto: 'Sí, nos parece excelente' },
      { valor: 'talvez', texto: 'Tal vez, dependiendo del precio' },
      { valor: 'no', texto: 'No' },
    ],
  },
  {
    id: 'presentacion',
    texto: '¿Qué presentación sin perder la frescura sería más práctica en empaque al vacío?',
    opciones: [
      { valor: '500g', texto: 'Paquetes de 500 gramos (1 libra)' },
      { valor: '1000g', texto: 'Paquetes de 1.000 gramos (2 libras)' },
      { valor: 'familiares', texto: 'Paquetes familiares de 2 a 5 kilos' },
      { valor: 'pedidos', texto: 'Pedidos al por mayor según requerimiento' },
    ],
  },
  {
    id: 'precio_libra',
    texto:
      '¿Cuánto estarías dispuesto a pagar por una libra (500 g) de carne de cerdo magra, fresca y empacada al vacío?',
    opciones: [
      { valor: 'rango1', texto: '$ 7.500 - $ 9.500' },
      { valor: 'rango2', texto: '$ 10.000 - $ 13.000' },
      { valor: 'rango3', texto: 'Más de $ 13.000 (dependiendo del corte especial)' },
    ],
  },
  {
    id: 'medio',
    texto: '¿Por qué medio preferirías realizar tus pedidos directamente a la granja?',
    opciones: [
      { valor: 'whatsapp', texto: 'WhatsApp Business / Llamada telefónica' },
      { valor: 'domicilio', texto: 'Entrega programada semanal a domicilio' },
      { valor: 'punto', texto: 'Compra directa en punto de venta / granja' },
      { valor: 'redes', texto: 'Redes sociales (Facebook / Instagram)' },
    ],
  },
];

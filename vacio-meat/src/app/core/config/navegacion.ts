export interface ItemNav {
  ruta: string;
  texto: string;
}

export const NAV: ItemNav[] = [
  { ruta: '/', texto: 'Inicio' },
  { ruta: '/historia', texto: 'Nosotros' },
  { ruta: '/productos', texto: 'El proyecto' },
  { ruta: '/proceso', texto: 'Proceso' },
  { ruta: '/contacto', texto: 'Contacto' },
];

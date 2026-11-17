export interface ItemNav {
  ruta: string;
  texto: string;
  icono?: string;
  exacto?: boolean;
  destacado?: boolean;
}

export const NAV: ItemNav[] = [
  { ruta: '/', texto: 'Inicio', icono: '🏠', exacto: true },
  { ruta: '/historia', texto: 'Nosotros', icono: '🐖' },
  { ruta: '/productos', texto: 'El proyecto', icono: '🥩' },
  { ruta: '/proceso', texto: 'Proceso', icono: '⚙️' },
  { ruta: '/contacto', texto: 'Contacto', icono: '📲', destacado: true }
];
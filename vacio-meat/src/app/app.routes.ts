import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'VACÍO MEAT co. | Carnicería artesanal empacada al vacío',
    loadComponent: () => import('./features/inicio/inicio.page').then((m) => m.InicioPage),
  },
  {
    path: 'productos',
    title: 'Productos | VACÍO MEAT co.',
    loadComponent: () => import('./features/productos/productos.page').then((m) => m.ProductosPage),
  },
  {
    path: 'proceso',
    title: 'El poder del vacío | VACÍO MEAT co.',
    loadComponent: () => import('./features/proceso/proceso.page').then((m) => m.ProcesoPage),
  },
  {
    path: 'historia',
    title: 'Nuestra historia | VACÍO MEAT co.',
    loadComponent: () => import('./features/historia/historia.page').then((m) => m.HistoriaPage),
  },
  {
    path: 'contacto',
    title: 'Contacto | VACÍO MEAT co.',
    loadComponent: () => import('./features/contacto/contacto.page').then((m) => m.ContactoPage),
  },
  {
    path: '**',
    title: 'Página no encontrada | VACÍO MEAT co.',
    loadComponent: () =>
      import('./features/no-encontrada/no-encontrada.page').then((m) => m.NoEncontradaPage),
  },
];

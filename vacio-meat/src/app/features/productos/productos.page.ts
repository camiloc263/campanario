import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductosGridComponent } from './components/productos-grid/productos-grid.component';
import { FichaProductoComponent } from './components/ficha-producto/ficha-producto.component';
import { BotonComponent } from '../../shared/ui/boton/boton.component';
import { urlWhatsapp } from '../../core/config/contacto';

@Component({
  selector: 'app-productos-page',
  standalone: true,
  imports: [ProductosGridComponent, FichaProductoComponent, BotonComponent, RouterLink],
  template: `
    <app-productos-grid />
    <app-ficha-producto />
    <section class="cta wrap">
      <p>¿Quieres cotizar o hacer un pedido?</p>
      <app-boton [href]="pedido">Hacer pedido por WhatsApp</app-boton>
      <a class="enlace" routerLink="/contacto">Ver otras formas de contacto</a>
    </section>
  `,
  styles: [`
    .cta { display: grid; justify-items: center; gap: 1rem; padding-bottom: 4rem; text-align: center; }
    .cta p { margin: 0; font-weight: 600; }
    .enlace { font-size: .9rem; color: var(--brand); }
  `],
})
export class ProductosPage {
  pedido = urlWhatsapp('Hola, quiero hacer un pedido.');
}
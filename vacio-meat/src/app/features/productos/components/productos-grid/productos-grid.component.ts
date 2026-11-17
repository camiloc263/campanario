import { Component } from '@angular/core';
import { TituloSeccionComponent } from '../../../../shared/ui/titulo-seccion/titulo-seccion.component';
import { ProductoCardComponent } from '../producto-card/producto-card.component';
import { PRODUCTOS } from '../../data/productos.data';

@Component({
  selector: 'app-productos-grid',
  standalone: true,
  imports: [TituloSeccionComponent, ProductoCardComponent],
  template: `
    <section class="section" id="lider">
      <div class="wrap">
        <app-titulo-seccion>Perfil del líder y descripción del proyecto</app-titulo-seccion>
        <div class="grid">
          @for (p of productos; track p.nombre) {
            <app-producto-card [producto]="p" />
          }
        </div>
      </div>
    </section>
  `,

  styles: [`.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem; }`],
})
export class ProductosGridComponent {
  productos = PRODUCTOS;
}

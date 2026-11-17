import { Component } from '@angular/core';
import { BeneficiosComponent } from './components/beneficios/beneficios.component';
import { BotonComponent } from '../../shared/ui/boton/boton.component';

@Component({
  selector: 'app-proceso-page',
  standalone: true,
  imports: [BeneficiosComponent, BotonComponent],
  template: `
    <app-beneficios />
    <section class="cta wrap">
      <app-boton ruta="/productos">Ver nuestros productos</app-boton>
    </section>
  `,
  styles: [`.cta { display: grid; justify-items: center; padding-bottom: 4rem; }`],
})
export class ProcesoPage {}

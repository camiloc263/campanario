import { Component } from '@angular/core';
import { BotonComponent } from '../../shared/ui/boton/boton.component';

@Component({
  selector: 'app-no-encontrada-page',
  standalone: true,
  imports: [BotonComponent],
  template: `
    <section class="section wrap vacio">
      <h1>No encontramos esta página</h1>
      <p>El enlace puede estar mal escrito o la página ya no existe.</p>
      <app-boton ruta="/">Volver al inicio</app-boton>
    </section>
  `,
  styles: [`
    .vacio { display: grid; justify-items: center; gap: 1rem; text-align: center; }
    h1 { font-size: clamp(1.5rem, 3vw, 2.2rem); font-weight: 800; }
    p { margin: 0; color: var(--muted); }
  `],
})
export class NoEncontradaPage {}

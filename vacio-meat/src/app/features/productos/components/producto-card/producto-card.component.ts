import { Component, input } from '@angular/core';
import { Producto } from '../../../../shared/models/producto.model';

@Component({
  selector: 'app-producto-card',
  standalone: true,
  template: `
    <article class="card">
      <div class="img">
        <img [src]="producto().imagen" [alt]="producto().nombre" width="360" height="240" loading="lazy">
      </div>
      <div class="body">
        <h3>{{ producto().nombre }}</h3>
        <p>{{ producto().descripcion }}</p>
      </div>
    </article>
  `,
  styles: [`
    .card { background: var(--surface); border-radius: var(--radius); padding: .6rem; height: 100%;
            box-shadow: 0 1px 2px rgba(0,0,0,.08), 0 4px 14px rgba(0,0,0,.05); }
    .img { border-radius: 6px; overflow: hidden; aspect-ratio: 3 / 2; background: var(--band); }
    .img img { width: 100%; height: 100%; object-fit: cover; }
    .body { padding: .9rem .5rem .6rem; }
    h3 { font-size: 1.1rem; font-weight: 700; }
    p { margin: .4rem 0 0; font-size: .9rem; color: var(--muted); }
  `],
})
export class ProductoCardComponent {
  producto = input.required<Producto>();
}

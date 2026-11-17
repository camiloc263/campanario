import { Component, input } from '@angular/core';
import { IconoFicha } from '../../data/ficha.model';

@Component({
  selector: 'app-icono-ficha',
  standalone: true,
  template: `
    <svg viewBox="0 0 64 64" [attr.width]="tam()" [attr.height]="tam()" fill="none"
         stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"
         aria-hidden="true">
      @switch (nombre()) {
        @case ('vacio') {
          <rect x="8" y="16" width="48" height="32" rx="5"/>
          <path d="M14 22v20M50 22v20"/>
          <ellipse cx="32" cy="32" rx="12" ry="8"/>
        }
        @case ('parrilla') {
          <path d="M10 28h44a22 14 0 0 1-44 0z"/>
          <path d="M20 46l-4 10M44 46l4 10M24 20c-2-3 2-4 0-8M34 20c-2-3 2-4 0-8M44 20c-2-3 2-4 0-8"/>
        }
        @case ('camion') {
          <rect x="6" y="20" width="32" height="24" rx="3"/>
          <path d="M38 28h10l8 8v8H38z"/>
          <circle cx="18" cy="48" r="5"/><circle cx="46" cy="48" r="5"/>
        }
        @case ('hoja') {
          <path d="M12 52C12 30 26 14 52 12c0 26-14 40-36 40"/>
          <path d="M12 52c8-14 18-24 30-30"/>
        }
        @case ('equipos') {
          <rect x="8" y="26" width="48" height="22" rx="4"/>
          <path d="M14 26v-8h36v8M20 37h14M44 37h.01M16 48v6M48 48v6"/>
        }
      }
    </svg>
  `,
  styles: [`:host { display: inline-flex; }`],
})
export class IconoFichaComponent {
  nombre = input.required<IconoFicha>();
  tam = input(48);
}

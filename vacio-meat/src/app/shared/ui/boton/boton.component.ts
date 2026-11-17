import { Component, input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';

/** Botón-enlace. Usa `ruta` para navegar dentro de la app o `href` para enlaces externos. */
@Component({
  selector: 'app-boton',
  standalone: true,
  imports: [RouterLink, NgTemplateOutlet],
  template: `
    <ng-template #contenido><ng-content /></ng-template>
    @if (ruta()) {
      <a class="btn" [routerLink]="ruta()"><ng-container [ngTemplateOutlet]="contenido" /></a>
    } @else {
      <a class="btn" [href]="href()" target="_blank" rel="noopener">
        <ng-container [ngTemplateOutlet]="contenido" />
      </a>
    }
  `,
})
export class BotonComponent {
  ruta = input<string>();
  href = input<string>();
}

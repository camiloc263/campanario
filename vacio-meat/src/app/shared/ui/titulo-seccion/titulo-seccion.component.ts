import { Component, input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-titulo-seccion',
  standalone: true,
  imports: [NgTemplateOutlet],
  template: `
    <ng-template #contenido><ng-content /></ng-template>
    @if (nivel() === 'h1') {
      <h1 class="section-title">ng-container [ngTemplateOutlet]="contenido" /></h1>
    } @else {
      <h2 class="section-title"><ng-container [ngTemplateOutlet]="contenido" /></h2>
    }
  `,
})
export class TituloSeccionComponent {
  nivel = input<'h1' | 'h2'>('h2');
}

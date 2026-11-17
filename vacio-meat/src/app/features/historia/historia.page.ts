import { Component } from '@angular/core';
import { NosotrosComponent } from './components/nosotros/nosotros.component';

@Component({
  selector: 'app-historia-page',
  standalone: true,
  imports: [NosotrosComponent],
  template: `<app-nosotros />`,
})
export class HistoriaPage {}

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './core/layout/header/header.component';
import { FooterComponent } from './core/layout/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <app-header />
    <main><router-outlet /></main>
    <app-footer />
  `,
  styles: [`
    :host { 
      display: flex; 
      flex-direction: column; 
      min-height: 100vh; 
    } 
    main { 
      flex: 1; 
      padding-top: 73px; /* Espacio exacto para que el contenido no quede debajo del header fijo */
    }
  `],
})
export class AppComponent { }
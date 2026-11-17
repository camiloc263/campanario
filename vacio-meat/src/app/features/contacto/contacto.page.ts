import { Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CONTACTO, MAPA_URL } from '../../core/config/contacto';
import { TituloSeccionComponent } from '../../shared/ui/titulo-seccion/titulo-seccion.component';
import { FormularioContactoComponent } from './components/formulario-contacto/formulario-contacto.component';

@Component({
  selector: 'app-contacto-page',
  standalone: true,
  imports: [TituloSeccionComponent, FormularioContactoComponent],
  template: `
    <section class="section">
      <div class="wrap">
        <app-titulo-seccion nivel="h1">Contacto</app-titulo-seccion>
        <div class="grid">
          <app-formulario-contacto />
          <div>
            <h2>Datos</h2>
            <ul>
              <li><a [href]="'tel:' + c.telefono.replace(' ', '')">{{ c.telefono }}</a></li>
              <li><a [href]="'mailto:' + c.email">{{ c.email }}</a></li>
              <li>{{ c.direccion }}</li>
            </ul>
            <iframe class="mapa" [src]="mapa" title="Mapa de Linares, Nariño" loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade"></iframe>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: start; }
    h2 { font-size: 1.1rem; font-weight: 700; margin-bottom: 1rem; }
    ul { list-style: none; margin: 0 0 1.2rem; padding: 0; display: grid; gap: .4rem; color: var(--muted); }
    ul a { text-decoration: none; } ul a:hover { color: var(--brand); }
    .mapa { width: 100%; height: 260px; border: 0; border-radius: var(--radius); }
    @media (max-width: 760px) { .grid { grid-template-columns: 1fr; gap: 2rem; } }
  `],
})
export class ContactoPage {
  c = CONTACTO;
  mapa = inject(DomSanitizer).bypassSecurityTrustResourceUrl(MAPA_URL);
}

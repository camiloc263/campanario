import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CONTACTO } from '../../config/contacto';
import { NAV } from '../../config/navegacion';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="foot">
      <div class="wrap grid">
        <div>
          <h3>Contacto</h3>
          <ul class="lista">
            <li><a [href]="'tel:' + c.telefono.replace(' ', '')">{{ c.telefono }}</a></li>
            <li><a [href]="'mailto:' + c.email">{{ c.email }}</a></li>
            <li>{{ c.direccion }}</li>
          </ul>
        </div>
        <div>
          <h3>Navegación</h3>
          <ul class="lista">
            @for (item of nav; track item.ruta) {
              <li><a [routerLink]="item.ruta">{{ item.texto }}</a></li>
            }
          </ul>
        </div>
        <div>
          <h3>Redes sociales</h3>
          <div class="redes">
            <a href="#" aria-label="Facebook" class="red">f</a>
            <a href="#" aria-label="Instagram" class="red">ig</a>
            <a [href]="'https://wa.me/' + c.whatsapp" aria-label="WhatsApp" class="red" target="_blank" rel="noopener">wa</a>
          </div>
        </div>
      </div>
      <p class="copy wrap">© {{ year }} VACÍO MEAT co. Todos los derechos reservados.</p>
    </footer>
  `,
  styles: [`
    .foot { border-top: 1px solid var(--line); padding-top: 2.5rem; }
    .grid { display: grid; grid-template-columns: 1.3fr 1fr 1fr; gap: 2rem; }
    h3 { font-size: .8rem; font-weight: 700; margin-bottom: .8rem; }
    .lista { list-style: none; margin: 0; padding: 0; display: grid; gap: .4rem; font-size: .88rem; color: var(--muted); }
    .lista a { text-decoration: none; }
    .lista a:hover { color: var(--brand); }
    .redes { display: flex; gap: .5rem; }
    .red { width: 32px; height: 32px; border-radius: 50%; background: var(--brand); color: #fff;
           display: grid; place-items: center; font-size: .7rem; font-weight: 700; text-decoration: none; }
    .red:hover { background: var(--brand-dark); }
    .copy { margin: 2rem auto 0; padding-block: 1.2rem; border-top: 1px solid var(--line);
            font-size: .75rem; color: var(--muted); }
    @media (max-width: 760px) { .grid { grid-template-columns: 1fr; } }
  `],
})
export class FooterComponent {
  c = CONTACTO;
  nav = NAV;
  año = new Date().getFullYear();
  year = this.año;
}

import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { urlWhatsapp } from '../../config/contacto';
import { NAV } from '../../config/navegacion';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="top">
      <div class="brand-row wrap">
        <button class="burger" type="button" aria-label="Abrir menú"
                [attr.aria-expanded]="abierto()" (click)="abierto.set(!abierto())">
          <span></span><span></span><span></span>
        </button>

        <a routerLink="/" class="brand" aria-label="VACÍO MEAT co., inicio">
          <img src="/images/brand/logo.png" alt="VACÍO MEAT co." class="logo-img">
        </a>

        <a class="cart" [href]="pedido" target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor"
               stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/>
            <path d="M2 3h3l2.6 12.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 7H6"/>
          </svg>
          <span>Hacer Pedido</span>
        </a>
      </div>

      <nav class="menu" [class.open]="abierto()" aria-label="Principal">
        <ul class="wrap">
          @for (item of nav; track item.ruta) {
            <li>
              <a [routerLink]="item.ruta" routerLinkActive="active"
                 [routerLinkActiveOptions]="{ exact: true }"
                 (click)="abierto.set(false)">{{ item.texto }}</a>
            </li>
          }
        </ul>
      </nav>
    </header>
  `,
  styles: [`
    .top { position: sticky; top: 0; z-index: 20; background: var(--bg); border-bottom: 1px solid var(--line); }
    .brand-row { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; padding-block: .6rem; }
    .brand { grid-column: 2; display: flex; align-items: center; text-decoration: none; }
    .logo-img { height: 180px; width: auto; display: block; }
    .cart { grid-column: 3; justify-self: end; display: inline-flex; gap: .5rem; align-items: center;
            text-decoration: none; font-size: .9rem; font-weight: 500; }
    .cart:hover { color: var(--brand); }
    .burger { display: none; grid-column: 1; justify-self: start; background: none; border: 0; padding: .5rem; cursor: pointer; }
    .burger span { display: block; width: 22px; height: 2px; background: var(--ink); margin: 4px 0; }

    .menu ul { list-style: none; margin: 0 auto; padding: 0; display: flex; justify-content: center; gap: 2rem; }
    .menu a { display: block; padding: .8rem 0; font-size: .85rem; font-weight: 500; text-decoration: none;
              color: var(--ink); border-bottom: 2px solid transparent; }
    .menu a:hover { color: var(--brand); }
    .menu a.active { border-color: var(--brand); font-weight: 700; }

    @media (max-width: 760px) {
      .burger { display: block; }
      .brand-row { padding-block: .4rem; }
      .logo-img { height: 120px; }
      .cart span { display: none; }
      .menu { display: none; border-top: 1px solid var(--line); background: var(--bg); }
      .menu.open { display: block; }
      .menu ul { flex-direction: column; gap: 0; }
      .menu a { padding: .9rem 0; border-bottom: 1px solid var(--line); }
      .menu a.active { border-bottom-color: var(--brand); }
    }
  `],
})
export class HeaderComponent {
  abierto = signal(false);
  nav = NAV;
  pedido = urlWhatsapp('Hola, quiero hacer un pedido.');
}

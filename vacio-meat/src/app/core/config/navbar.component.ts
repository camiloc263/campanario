import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NAV, ItemNav } from './navegacion'; // Ajusta la ruta según tu carpeta

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterLinkActive],
    template: `
    <header class="navbar-wrapper" [class.scrolled]="isScrolled()">
      <div class="navbar-container">
        
        <!-- MARCA / LOGO -->
        <a routerLink="/" class="brand" (click)="cerrarMenu()">
          <span class="brand-badge">🐖</span>
          <div class="brand-info">
            <span class="brand-title">Carnes Campanario</span>
            <span class="brand-sub">Linares · Nariño</span>
          </div>
        </a>

        <!-- NAVEGACIÓN ESCRITORIO -->
        <nav class="nav-desktop" aria-label="Navegación principal">
          <a
            *ngFor="let item of items"
            [routerLink]="item.ruta"
            routerLinkActive="active-link"
            [routerLinkActiveOptions]="{ exact: !!item.exacto }"
            class="nav-link"
            [class.nav-cta]="item.destacado"
          >
            <span class="nav-icon" *ngIf="item.icono">{{ item.icono }}</span>
            <span>{{ item.texto }}</span>
          </a>
        </nav>

        <!-- BOTÓN HAMBURGUESA MÓVIL -->
        <button
          type="button"
          class="menu-toggle"
          (click)="toggleMenu()"
          [attr.aria-expanded]="menuAbierto()"
          aria-label="Abrir menú de navegación"
        >
          <span class="bar" [class.open]="menuAbierto()"></span>
          <span class="bar" [class.open]="menuAbierto()"></span>
          <span class="bar" [class.open]="menuAbierto()"></span>
        </button>

      </div>

      <!-- MENÚ DESPLEGABLE MÓVIL -->
      <div class="nav-mobile" [class.is-open]="menuAbierto()">
        <a
          *ngFor="let item of items"
          [routerLink]="item.ruta"
          routerLinkActive="active-mobile"
          [routerLinkActiveOptions]="{ exact: !!item.exacto }"
          class="mobile-link"
          [class.mobile-cta]="item.destacado"
          (click)="cerrarMenu()"
        >
          <span class="nav-icon">{{ item.icono }}</span>
          <span>{{ item.texto }}</span>
        </a>
      </div>
    </header>
  `,
    styles: [`
    .navbar-wrapper {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: #ffffff;
      border-bottom: 1px solid #e2e8f0;
      transition: all 0.3s ease;
    }

    /* Efecto dinámico al hacer scroll */
    .navbar-wrapper.scrolled {
      background: rgba(255, 255, 255, 0.92);
      backdrop-filter: blur(10px);
      box-shadow: 0 6px 24px rgba(15, 41, 74, 0.08);
    }

    .navbar-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0.85rem 1.25rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      transition: padding 0.3s ease;
    }
    .navbar-wrapper.scrolled .navbar-container {
      padding: 0.6rem 1.25rem;
    }

    /* LOGO */
    .brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
    }
    .brand-badge {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: #0f294a;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.3rem;
      box-shadow: 0 3px 8px rgba(15, 41, 74, 0.2);
    }
    .brand-info {
      display: flex;
      flex-direction: column;
    }
    .brand-title {
      font-size: 1.05rem;
      font-weight: 800;
      color: #0f294a;
      line-height: 1.1;
    }
    .brand-sub {
      font-size: 0.72rem;
      font-weight: 600;
      color: #718096;
      letter-spacing: 0.4px;
    }

    /* MENÚ ESCRITORIO */
    .nav-desktop {
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }
    .nav-link {
      position: relative;
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.55rem 0.95rem;
      border-radius: 8px;
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 600;
      color: #334155;
      transition: all 0.2s ease;
    }
    .nav-link:hover {
      background: #f1f5f9;
      color: #0f294a;
    }

    /* Indicador de ruta activa */
    .nav-link.active-link {
      color: #0f294a;
      background: #eff6ff;
      font-weight: 700;
    }
    .nav-link.active-link::after {
      content: '';
      position: absolute;
      bottom: 3px;
      left: 20%;
      width: 60%;
      height: 2.5px;
      border-radius: 99px;
      background: #d69e2e;
    }

    /* Botón destacado (Contacto) */
    .nav-link.nav-cta {
      margin-left: 0.5rem;
      background: #0f294a;
      color: #ffffff;
      box-shadow: 0 3px 10px rgba(15, 41, 74, 0.18);
    }
    .nav-link.nav-cta:hover {
      background: #1e3a8a;
      transform: translateY(-1px);
    }
    .nav-link.nav-cta.active-link::after {
      display: none;
    }

    /* BOTÓN HAMBURGUESA (OCULTO EN ESCRITORIO) */
    .menu-toggle {
      display: none;
      flex-direction: column;
      justify-content: center;
      gap: 5px;
      width: 38px;
      height: 38px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      cursor: pointer;
      padding: 0 8px;
    }
    .bar {
      width: 100%;
      height: 2px;
      background: #0f294a;
      border-radius: 2px;
      transition: transform 0.25s ease, opacity 0.25s ease;
    }
    .bar.open:nth-child(1) {
      transform: translateY(7px) rotate(45deg);
    }
    .bar.open:nth-child(2) {
      opacity: 0;
    }
    .bar.open:nth-child(3) {
      transform: translateY(-7px) rotate(-45deg);
    }

    /* MENÚ MÓVIL */
    .nav-mobile {
      display: none;
      flex-direction: column;
      background: #ffffff;
      border-top: 1px solid #e2e8f0;
      padding: 0 1.25rem;
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease, padding 0.3s ease;
    }
    .nav-mobile.is-open {
      max-height: 360px;
      padding: 0.85rem 1.25rem 1.15rem;
    }
    .mobile-link {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      padding: 0.75rem 0.85rem;
      border-radius: 8px;
      text-decoration: none;
      font-size: 0.95rem;
      font-weight: 600;
      color: #334155;
    }
    .mobile-link.active-mobile {
      background: #eff6ff;
      color: #0f294a;
      font-weight: 700;
    }
    .mobile-link.mobile-cta {
      margin-top: 0.4rem;
      background: #0f294a;
      color: #ffffff;
      justify-content: center;
    }

    @media (max-width: 820px) {
      .nav-desktop {
        display: none;
      }
      .menu-toggle,
      .nav-mobile {
        display: flex;
      }
    }
  `]
})
export class NavbarComponent {
    items: ItemNav[] = NAV;
    menuAbierto = signal(false);
    isScrolled = signal(false);

    @HostListener('window:scroll')
    onWindowScroll() {
        this.isScrolled.set(window.scrollY > 24);
    }

    toggleMenu() {
        this.menuAbierto.update(estado => !estado);
    }

    cerrarMenu() {
        this.menuAbierto.set(false);
    }
}
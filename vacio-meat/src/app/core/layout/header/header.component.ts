import {
  afterNextRender, Component, DestroyRef, ElementRef, HostListener, effect, inject, signal, viewChild, viewChildren,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

export interface ItemNav {
  ruta: string;          // '/' o '/#id-de-la-seccion'
  texto: string;
  destacado?: boolean;   // se muestra como botón al final
}

/** Cada enlace con "#" debe coincidir con el id de una sección de la página de inicio. */
export const NAV: ItemNav[] = [
  { ruta: '/', texto: 'Inicio' },
  { ruta: '/#lider', texto: 'Perfil del líder' },
  { ruta: '/#problema', texto: 'El problema' },
  { ruta: '/#servicio', texto: 'Innovación' },
  { ruta: '/#ficha-tecnica', texto: 'Ficha técnica' },
  { ruta: '/#validacion', texto: 'Validación' },
  { ruta: '/#encuesta', texto: 'Encuesta' },
  { ruta: '/#mercado', texto: 'Mercado', destacado: true },
];

const idDe = (ruta: string): string => ruta.split('#')[1] ?? '';

@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <header class="top" [class.scrolled]="scrolled()" [class.oculto]="oculto()">
      <div class="wrap barra">

        <!-- Marca (abre el logo en grande) -->
        <button type="button" class="brand" (click)="abrirLogo()" aria-label="Ver el logo en grande">
          @if (!logoRoto()) {
            <img src="images/brand/logo.png" alt="" width="38" height="38" (error)="logoRoto.set(true)">
          } @else {
            <span class="mono" aria-hidden="true">EC</span>
          }
          <span class="brand-txt">
            <strong>Carnes Campanario</strong>
            <small>Linares · Nariño</small>
          </span>
        </button>

        <!-- Navegación de escritorio -->
        <nav class="nav" #nav aria-label="Navegación principal">
          <ul>
            @for (it of items; track it.ruta; let i = $index) {
              <li>
                <a #enlace class="link" [href]="href(it)" [class.on]="activo() === i" [class.cta]="it.destacado"
                   [attr.aria-current]="activo() === i ? 'true' : null" (click)="irA($event, it)">{{ it.texto }}</a>
              </li>
            }
          </ul>
          <span class="ind" aria-hidden="true" [class.vis]="ind().visible"
                [style.transform]="'translateX(' + ind().x + 'px)'" [style.width.px]="ind().w"></span>
        </nav>

        <!-- Botón de menú (móvil) -->
        <button type="button" class="burger" [class.on]="menuAbierto()" [attr.aria-expanded]="menuAbierto()"
                aria-controls="menu-movil" [attr.aria-label]="menuAbierto() ? 'Cerrar menú' : 'Abrir menú'"
                (click)="menuAbierto.set(!menuAbierto())">
          <i></i><i></i>
        </button>
      </div>

      <!-- Progreso de lectura -->
      <div class="progreso" aria-hidden="true">
        <span [style.transform]="'scaleX(' + progreso() + ')'"></span>
      </div>
    </header>

    <!-- Menú móvil -->
    <div class="movil" id="menu-movil" [class.abierto]="menuAbierto()">
      <nav aria-label="Menú móvil">
        <ol>
          @for (it of items; track it.ruta; let i = $index) {
            <li [style.--i]="i">
              <a class="m-link" [href]="href(it)" [class.on]="activo() === i" [class.cta]="it.destacado"
                 [attr.aria-current]="activo() === i ? 'true' : null" (click)="irA($event, it)">
                <span class="n">{{ numero(i) }}</span>{{ it.texto }}
              </a>
            </li>
          }
        </ol>
      </nav>
      <p class="m-pie">Granja Porcícola El Campanario · Linares, Nariño</p>
    </div>

    <!-- Logo ampliado -->
    <dialog #dlgLogo class="dlg" aria-labelledby="logo-titulo" (click)="cerrarLogoFuera($event)">
      <button type="button" class="dlg-x" aria-label="Cerrar" (click)="cerrarLogo()">×</button>
      <div class="dlg-img">
        @if (!logoRoto()) {
          <img src="images/brand/logo.png" alt="Logo de Carnes Campanario">
        } @else {
          <span class="mono grande" aria-hidden="true">EC</span>
        }
      </div>
      <h3 id="logo-titulo">Carnes Campanario</h3>
      <p>Linares · Nariño</p>
    </dialog>
  `,
  styles: [`
    :host { display: block; }

    /* ---------- Barra ---------- */
    .top { position: fixed; inset: 0 0 auto 0; z-index: 1000; border-bottom: 1px solid transparent;
           background: color-mix(in srgb, var(--bg) 86%, transparent); backdrop-filter: blur(14px) saturate(1.4);
           transition: transform .35s ease, border-color .3s ease, box-shadow .3s ease; }
    .top.scrolled { border-bottom-color: var(--line); box-shadow: 0 6px 24px rgba(0,0,0,.05); }
    .top.oculto { transform: translateY(-101%); }
    .top:focus-within { transform: none; }
    .barra { height: var(--header-h, 64px); display: flex; align-items: center; justify-content: space-between; gap: 1.5rem; }

    /* ---------- Marca ---------- */
    .brand { display: flex; align-items: center; gap: .7rem; padding: .25rem .5rem .25rem 0; background: none; border: 0;
             font: inherit; color: inherit; text-align: left; cursor: pointer; }
    .brand img { width: 100px; height: 70px; object-fit: contain; transition: transform .3s ease; }
    .brand:hover img, .brand:hover .mono { transform: rotate(-6deg) scale(1.08); }
    .mono { width: 38px; height: 38px; display: grid; place-items: center; border-radius: 50%; background: var(--brand);
            color: #fff; font-size: .8rem; font-weight: 800; letter-spacing: .02em; transition: transform .3s ease; }
    .mono.grande { width: 96px; height: 96px; font-size: 1.6rem; }
    .brand-txt { display: grid; gap: .1rem; }
    .brand-txt strong { font-size: .98rem; font-weight: 800; letter-spacing: -.01em; line-height: 1.1; color: var(--ink); }
    .brand-txt small { font-size: .66rem; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--wood); }

    /* ---------- Navegación ---------- */
    .nav { position: relative; }
    .nav ul { list-style: none; margin: 0; padding: 0; display: flex; align-items: center; gap: .15rem; }
    .link { display: block; padding: .55rem .75rem; border-radius: 6px; font-size: .84rem; font-weight: 600;
            white-space: nowrap; text-decoration: none; color: var(--muted); transition: color .2s ease, background .2s ease; }
    .link:hover, .link.on { color: var(--ink); }
    .link.cta { margin-left: .5rem; padding: .5rem 1.05rem; border: 1.5px solid var(--brand); border-radius: 999px; color: var(--brand); }
    .link.cta:hover, .link.cta.on { background: var(--brand); color: #fff; }

    /* subrayado deslizante bajo el enlace activo */
    .ind { position: absolute; left: 0; bottom: 2px; height: 2px; border-radius: 2px; background: var(--brand); opacity: 0;
           transition: transform .35s cubic-bezier(.4, 0, .2, 1), width .35s cubic-bezier(.4, 0, .2, 1), opacity .2s ease; }
    .ind.vis { opacity: 1; }

    /* ---------- Progreso de lectura ---------- */
    .progreso { position: absolute; left: 0; right: 0; bottom: -1px; height: 2px; overflow: hidden; pointer-events: none; }
    .progreso span { display: block; height: 100%; transform-origin: left; transform: scaleX(0);
                     background: linear-gradient(90deg, var(--brand), var(--wood)); }

    /* ---------- Botón de menú ---------- */
    .burger { display: none; position: relative; width: 42px; height: 42px; background: none; border: 0; cursor: pointer; }
    .burger i { position: absolute; left: 11px; right: 11px; height: 2px; border-radius: 2px; background: var(--ink);
                transition: transform .3s ease, top .3s ease; }
    .burger i:nth-child(1) { top: 16px; }
    .burger i:nth-child(2) { top: 24px; }
    .burger.on i:nth-child(1) { top: 20px; transform: rotate(45deg); }
    .burger.on i:nth-child(2) { top: 20px; transform: rotate(-45deg); }

    /* ---------- Menú móvil ---------- */
    .movil { position: fixed; inset: var(--header-h, 64px) 0 0 0; z-index: 999; display: flex; flex-direction: column;
             justify-content: space-between; gap: 2rem; padding: 1rem 1.5rem 2rem; overflow-y: auto; background: var(--bg);
             opacity: 0; visibility: hidden; transform: translateY(-8px);
             transition: opacity .3s ease, transform .3s ease, visibility 0s linear .3s; }
    .movil.abierto { opacity: 1; visibility: visible; transform: none; transition-delay: 0s; }
    .movil ol { list-style: none; margin: 0; padding: 0; }
    .movil li { border-bottom: 1px solid var(--line); opacity: 0; transform: translateY(10px);
                transition: opacity .35s ease, transform .35s ease; }
    .movil.abierto li { opacity: 1; transform: none; transition-delay: calc(var(--i, 0) * 45ms + 100ms); }
    .m-link { display: flex; align-items: baseline; gap: 1rem; padding: 1rem .25rem; font-size: 1.3rem; font-weight: 700;
              text-decoration: none; color: var(--ink); }
    .m-link .n { width: 1.6rem; font-size: .75rem; font-weight: 700; color: var(--muted); font-variant-numeric: tabular-nums; }
    .m-link.on, .m-link.on .n, .m-link.cta { color: var(--brand); }
    .m-pie { margin: 0; font-size: .78rem; color: var(--muted); }

    /* ---------- Logo ampliado ---------- */
    .dlg { width: min(500px, 92vw); padding: 2rem 1.5rem 1.75rem; border: 0; border-radius: 18px; text-align: center;
           color: var(--ink); box-shadow: 0 24px 60px rgba(0,0,0,.3); }
    .dlg::backdrop { background: rgba(20,24,26,.5); backdrop-filter: blur(6px); }
    .dlg[open] { animation: entrar .25s ease; }
    @keyframes entrar { from { opacity: 0; transform: translateY(12px) scale(.96); } }
    .dlg-x { position: absolute; top: .6rem; right: .7rem; width: 34px; height: 34px; border: 0; border-radius: 50%; background: none;
             font-size: 1.6rem; line-height: 1; color: var(--muted); cursor: pointer; }
    .dlg-x:hover { background: var(--band); color: var(--ink); }
    .dlg-img { display: grid; place-items: center; min-height: 190px; margin-bottom: 1rem; border-radius: 14px; background: var(--bg);
               border: 1px solid var(--line); }
    .dlg-img img { max-width: 170px; max-height: 170px; object-fit: contain; }
    .dlg h3 { font-size: 1.15rem; font-weight: 800; }
    .dlg p { margin: .2rem 0 0; font-size: .72rem; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--wood); }

    /* ---------- Responsive ---------- */
    @media (max-width: 1120px) {
      .nav { display: none; }
      .burger { display: block; }
    }
    @media (min-width: 1121px) {
      .movil { display: none; }
    }
  `],
})
export class HeaderComponent {
  items: ItemNav[] = NAV;

  menuAbierto = signal(false);
  scrolled = signal(false);
  oculto = signal(false);
  progreso = signal(0);
  activo = signal(0);
  enInicio = signal(true);
  logoRoto = signal(false);
  ind = signal({ x: 0, w: 0, visible: false });

  private nav = viewChild.required<ElementRef<HTMLElement>>('nav');
  private enlaces = viewChildren<ElementRef<HTMLElement>>('enlace');
  private dlgLogo = viewChild.required<ElementRef<HTMLDialogElement>>('dlgLogo');

  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private ultimoY = 0;
  private raf = 0;
  private visibleHasta = 0;

  constructor() {
    this.enInicio.set(this.esInicio());

    // Al cambiar de página se recalcula la sección activa
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd), takeUntilDestroyed())
      .subscribe(() => {
        this.enInicio.set(this.esInicio());
        setTimeout(() => this.actualizar(), 80);
      });

    // Evita que la página se desplace por detrás del menú móvil abierto
    effect(() => {
      document.body.style.overflow = this.menuAbierto() ? 'hidden' : '';
    });
    this.destroyRef.onDestroy(() => {
      document.body.style.overflow = '';
      cancelAnimationFrame(this.raf);
    });

    // El subrayado se reposiciona cuando cambia el enlace activo
    effect(() => {
      this.activo();
      this.enlaces();
      queueMicrotask(() => this.medir());
    });

    afterNextRender(() => {
      this.ultimoY = window.scrollY;
      this.actualizar();
      this.medir();
    });
  }

  // ---------- Eventos globales ----------
  @HostListener('window:scroll')
  alScroll(): void {
    if (this.raf) return;
    this.raf = requestAnimationFrame(() => {
      this.raf = 0;
      this.actualizar();
    });
  }

  @HostListener('window:resize')
  alRedimensionar(): void {
    if (window.innerWidth > 1120) this.menuAbierto.set(false);
    this.medir();
  }

  @HostListener('document:keydown.escape')
  alEscape(): void {
    this.menuAbierto.set(false);
  }

  // ---------- Estado según el scroll ----------
  private actualizar(): void {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;

    this.scrolled.set(y > 8);
    this.progreso.set(max > 0 ? Math.min(1, y / max) : 0);

    // Se oculta al bajar y reaparece al subir
    const delta = y - this.ultimoY;
    if (this.menuAbierto() || y <= 120 || Date.now() < this.visibleHasta) {
      this.oculto.set(false);
    } else if (delta > 4) {
      this.oculto.set(true);
    } else if (delta < -4) {
      this.oculto.set(false);
    }
    this.ultimoY = y;

    this.activo.set(this.calcularActivo());
  }

  /** Sección que está en pantalla (la última cuyo inicio ya pasó por debajo del encabezado). */
  private calcularActivo(): number {
    if (!this.enInicio()) return -1;

    let activo = 0;
    let ultimoConSeccion = 0;
    this.items.forEach((it, i) => {
      const id = idDe(it.ruta);
      const el = id ? document.getElementById(id) : null;
      if (!el) return;
      ultimoConSeccion = i;
      if (el.getBoundingClientRect().top <= 120) activo = i;
    });

    const alFinal = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    return alFinal && ultimoConSeccion > 0 ? ultimoConSeccion : activo;
  }

  /** Posición del subrayado deslizante. */
  private medir(): void {
    const i = this.activo();
    const el = this.enlaces()[i]?.nativeElement;
    const item = this.items[i];
    if (!el || !item || item.destacado) {
      this.ind.update((v) => ({ ...v, visible: false }));
      return;
    }
    const n = this.nav().nativeElement.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    if (!r.width) return;
    this.ind.set({ x: r.left - n.left + 12, w: r.width - 24, visible: true });
  }

  // ---------- Navegación ----------
  href(it: ItemNav): string {
    return it.ruta;
  }

  numero(i: number): string {
    return String(i + 1).padStart(2, '0');
  }

  irA(ev: MouseEvent, it: ItemNav): void {
    if (ev.ctrlKey || ev.metaKey || ev.shiftKey || ev.button !== 0) return; // permite abrir en otra pestaña
    ev.preventDefault();
    this.menuAbierto.set(false);
    this.visibleHasta = Date.now() + 900;
    this.oculto.set(false);

    const id = idDe(it.ruta);

    if (!id) {
      if (this.enInicio()) window.scrollTo({ top: 0, behavior: this.suave() });
      else void this.router.navigateByUrl('/');
      return;
    }

    const el = document.getElementById(id);
    if (el && this.enInicio()) {
      this.desplazarA(el);
    } else {
      void this.router.navigate(['/'], { fragment: id }).then(() => this.esperarSeccion(id));
    }
  }

  private esInicio(): boolean {
    return this.router.url.split(/[?#]/)[0] === '/';
  }

  private desplazarA(el: HTMLElement): void {
    const y = el.getBoundingClientRect().top + window.scrollY - 72;
    window.scrollTo({ top: Math.max(0, y), behavior: this.suave() });
  }

  /** La página de inicio se carga bajo demanda: se espera a que exista la sección. */
  private esperarSeccion(id: string, intentos = 25): void {
    const el = document.getElementById(id);
    if (el) {
      this.desplazarA(el);
    } else if (intentos > 0) {
      setTimeout(() => this.esperarSeccion(id, intentos - 1), 100);
    }
  }

  private suave(): ScrollBehavior {
    return matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
  }

  // ---------- Logo ampliado ----------
  abrirLogo(): void {
    this.menuAbierto.set(false);
    const d = this.dlgLogo().nativeElement;
    if (!d.open) d.showModal();
  }

  cerrarLogo(): void {
    this.dlgLogo().nativeElement.close();
  }

  cerrarLogoFuera(ev: MouseEvent): void {
    if (ev.target === this.dlgLogo().nativeElement) this.cerrarLogo();
  }
}

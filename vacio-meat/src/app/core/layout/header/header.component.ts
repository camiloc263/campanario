import {
  afterNextRender,
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  effect,
  inject,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

export interface ItemNav {
  ruta: string;
  texto: string;
  destacado?: boolean;
  exacto?: boolean;
}

export const NAV: ItemNav[] = [
  { ruta: '/', texto: 'Inicio', exacto: true },
  { ruta: '/#lider', texto: 'Líder' },
  { ruta: '/#problema', texto: 'Problema' },
  { ruta: '/#servicio', texto: 'Innovación' },
  { ruta: '/#ficha-tecnica', texto: 'Ficha técnica' },
  { ruta: '/#validacion', texto: 'Validación' },
  { ruta: '/#encuesta', texto: 'Encuesta' },
  { ruta: '/#mercado', texto: 'Mercado' },
  { ruta: '/#competencia', texto: 'Competencia' },
  { ruta: '/#organizacional', texto: 'Org.' }, // Abreviado para ganar espacio
  { ruta: '/#financiera', texto: 'Financiera' },
  { ruta: '/#canvas', texto: 'Canvas' },
  { ruta: '/#proyeccion', texto: 'Proyección' },
];

const idDe = (ruta: string): string => ruta.split('#')[1] ?? '';

@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <header class="top" [class.scrolled]="scrolled()" [class.oculto]="oculto()">
      <div class="wrap barra">

        <!-- Marca -->
        <button type="button" class="brand" (click)="abrirLogo()" aria-label="Ver el logo en grande">
          @if (!logoRoto()) {
            <img src="images/brand/logo.png" alt="Carnes Campanario" (error)="logoRoto.set(true)">
          } @else {
            <span class="mono" aria-hidden="true">CC</span>
          }
          <span class="brand-txt">
            <strong>Campanario</strong>
            <small>Linares · Nariño</small>
          </span>
        </button>

        <!-- Navegación de escritorio optimizada para 12 elementos -->
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

        <!-- Botón de menú móvil -->
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
          <span class="mono grande" aria-hidden="true">CC</span>
        }
      </div>
      <h3 id="logo-titulo">Carnes Campanario</h3>
      <p>Linares · Nariño</p>
    </dialog>
  `,
  styles: [`
    :host { display: block; }

    .top { position: fixed; inset: 0 0 auto 0; z-index: 1000; border-bottom: 1px solid transparent;
           background: color-mix(in srgb, var(--bg) 92%, transparent); backdrop-filter: blur(14px) saturate(1.4);
           transition: transform .35s ease, border-color .3s ease, box-shadow .3s ease; }
    .top.scrolled { border-bottom-color: var(--line); box-shadow: 0 6px 24px rgba(0,0,0,.06); }
    .top.oculto { transform: translateY(-101%); }
    .top:focus-within { transform: none; }
    
    /* Contenedor principal ensanchado al máximo (1680px) para alojar todos los enlaces */
    .barra { max-width: 1680px; height: var(--header-h, 72px); display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; padding: 0 1rem; }

    /* Marca compacta y limpia */
    .brand { display: flex; align-items: center; gap: 0.5rem; padding: 0.2rem 0; background: none; border: 0;
             font: inherit; color: inherit; text-align: left; cursor: pointer; flex-shrink: 0; }
    .brand img { height: 42px; width: auto; max-width: 120px; object-fit: contain; transition: transform .3s ease; }
    .brand:hover img, .brand:hover .mono { transform: scale(1.04); }
    .mono { width: 38px; height: 38px; display: grid; place-items: center; border-radius: 50%; background: var(--brand);
            color: #fff; font-size: .8rem; font-weight: 800; }
    .mono.grande { width: 96px; height: 96px; font-size: 1.6rem; }
    .brand-txt { display: grid; gap: 0; }
    .brand-txt strong { font-size: 0.88rem; font-weight: 800; line-height: 1.1; color: var(--ink); white-space: nowrap; }
    .brand-txt small { font-size: 0.58rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--wood); }

    /* Navegación ultra compacta para que quepan todos los ítems */
    .nav { position: relative; }
    .nav ul { list-style: none; margin: 0; padding: 0; display: flex; align-items: center; gap: 0.05rem; }
    .link { display: block; padding: 0.35rem 0.45rem; border-radius: 5px; font-size: 0.73rem; font-weight: 600;
            white-space: nowrap; text-decoration: none; color: var(--muted); transition: color .2s ease, background .2s ease; }
    .link:hover, .link.on { color: var(--ink); background: color-mix(in srgb, var(--brand) 6%, transparent); }
    .link.cta { margin-left: 0.2rem; padding: 0.35rem 0.75rem; border: 1.5px solid var(--brand); border-radius: 999px; color: var(--brand); font-size: 0.73rem; }
    .link.cta:hover, .link.cta.on { background: var(--brand); color: #fff; }

    .ind { position: absolute; left: 0; bottom: 2px; height: 2px; border-radius: 2px; background: var(--brand); opacity: 0;
           transition: transform .3s cubic-bezier(.4, 0, .2, 1), width .3s cubic-bezier(.4, 0, .2, 1), opacity .2s ease; }
    .ind.vis { opacity: 1; }

    .progreso { position: absolute; left: 0; right: 0; bottom: -1px; height: 2px; overflow: hidden; pointer-events: none; }
    .progreso span { display: block; height: 100%; transform-origin: left; transform: scaleX(0);
                     background: linear-gradient(90deg, var(--brand), var(--wood)); }

    .burger { display: none; position: relative; width: 40px; height: 40px; background: none; border: 0; cursor: pointer; flex-shrink: 0; }
    .burger i { position: absolute; left: 10px; right: 10px; height: 2px; border-radius: 2px; background: var(--ink);
                transition: transform .3s ease, top .3s ease; }
    .burger i:nth-child(1) { top: 15px; }
    .burger i:nth-child(2) { top: 23px; }
    .burger.on i:nth-child(1) { top: 19px; transform: rotate(45deg); }
    .burger.on i:nth-child(2) { top: 19px; transform: rotate(-45deg); }

    .movil { position: fixed; inset: var(--header-h, 72px) 0 0 0; z-index: 999; display: flex; flex-direction: column;
             justify-content: space-between; gap: 2rem; padding: 1rem 1.5rem 2rem; overflow-y: auto; background: var(--bg);
             opacity: 0; visibility: hidden; transform: translateY(-8px);
             transition: opacity .3s ease, transform .3s ease, visibility 0s linear .3s; }
    .movil.abierto { opacity: 1; visibility: visible; transform: none; transition-delay: 0s; }
    .movil ol { list-style: none; margin: 0; padding: 0; }
    .movil li { border-bottom: 1px solid var(--line); opacity: 0; transform: translateY(10px);
                transition: opacity .35s ease, transform .35s ease; }
    .movil.abierto li { opacity: 1; transform: none; transition-delay: calc(var(--i, 0) * 30ms + 40ms); }
    .m-link { display: flex; align-items: baseline; gap: 1rem; padding: 0.75rem 0.25rem; font-size: 1.1rem; font-weight: 700;
              text-decoration: none; color: var(--ink); }
    .m-link .n { width: 1.6rem; font-size: 0.75rem; font-weight: 700; color: var(--muted); font-variant-numeric: tabular-nums; }
    .m-link.on, .m-link.on .n, .m-link.cta { color: var(--brand); }
    .m-pie { margin: 0; font-size: 0.78rem; color: var(--muted); text-align: center; }

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
    .dlg-img img { max-width: 220px; max-height: 180px; object-fit: contain; }
    .dlg h3 { font-size: 1.15rem; font-weight: 800; }
    .dlg p { margin: .2rem 0 0; font-size: .72rem; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--wood); }

    /* Breakpoint ampliado para pantallas estándar en las que 12 ítems requieren compresión */
    @media (max-width: 1360px) {
      .nav { display: none; }
      .burger { display: block; }
    }
    @media (min-width: 1361px) {
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

    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd), takeUntilDestroyed())
      .subscribe(() => {
        this.enInicio.set(this.esInicio());
        setTimeout(() => this.actualizar(), 80);
      });

    effect(() => {
      document.body.style.overflow = this.menuAbierto() ? 'hidden' : '';
    });
    this.destroyRef.onDestroy(() => {
      document.body.style.overflow = '';
      cancelAnimationFrame(this.raf);
    });

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
    if (window.innerWidth > 1360) this.menuAbierto.set(false);
    this.medir();
  }

  @HostListener('document:keydown.escape')
  alEscape(): void {
    this.menuAbierto.set(false);
  }

  private actualizar(): void {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;

    this.scrolled.set(y > 8);
    this.progreso.set(max > 0 ? Math.min(1, y / max) : 0);

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
    this.ind.set({ x: r.left - n.left + 6, w: r.width - 12, visible: true });
  }

  href(it: ItemNav): string {
    return it.ruta;
  }

  numero(i: number): string {
    return String(i + 1).padStart(2, '0');
  }

  irA(ev: MouseEvent, it: ItemNav): void {
    if (ev.ctrlKey || ev.metaKey || ev.shiftKey || ev.button !== 0) return;
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
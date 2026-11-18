import {
  afterNextRender, Component, DestroyRef, ElementRef, computed, inject, signal, viewChild,
} from '@angular/core';
import { TituloSeccionComponent } from '../../../../shared/ui/titulo-seccion/titulo-seccion.component';
import { PRODUCTOS } from '../../data/productos.data';

interface Par { rotulo: string; valor: string; }

/**
 * Si el texto tiene varios "Rótulo: valor" (por ejemplo "Líder / Representante: Jhonjan Portilla. Ubicación: ..."),
 * los separa para mostrarlos como fichas. Si no, devuelve todo el texto como párrafo.
 */
function formatear(texto: string): { intro: string; pares: Par[] } {
  const re = /(?:^|\.\s+)([A-ZÁÉÍÓÚÑ][^:.\n]{2,40}):\s+/g;
  const hallazgos = Array.from(texto.matchAll(re));
  if (hallazgos.length < 2) return { intro: texto, pares: [] };

  const limpiar = (v: string) => v.trim().replace(/\.$/, '');
  const primero = hallazgos[0];
  const intro = primero.index! > 0 ? texto.slice(0, primero.index! + 1).trim() : '';

  const pares = hallazgos.map((h, k) => {
    const inicio = h.index! + h[0].length;
    const fin = k + 1 < hallazgos.length ? hallazgos[k + 1].index! + 1 : texto.length;
    return { rotulo: h[1].trim(), valor: limpiar(texto.slice(inicio, fin)) };
  });
  return { intro, pares };
}

@Component({
  selector: 'app-productos-grid',
  standalone: true,
  imports: [TituloSeccionComponent],
  template: `
    <section class="section" id="lider">
      <div class="wrap">
        <app-titulo-seccion>Perfil del líder y descripción del proyecto</app-titulo-seccion>

        <div class="perfil" [class.visible]="visible()">

          <!-- ===== Pestañas ===== -->
          <div class="tabs" role="tablist" aria-label="Perfil del líder y descripción del proyecto">
            @for (p of productos; track p.nombre; let i = $index) {
              <button type="button" role="tab" class="tab" [id]="'perfil-tab-' + i" [style.--i]="i"
                      [class.on]="i === idx()" [attr.aria-selected]="i === idx()" aria-controls="perfil-panel"
                      [attr.tabindex]="i === idx() ? 0 : -1" (click)="ir(i)" (keydown)="teclas($event, i)">
                <span class="thumb">
                  @if (p.imagen && !fallo(i)) {
                    <img [src]="p.imagen" alt="" loading="lazy" (error)="falloImagen(i)">
                  } @else {
                    {{ numero(i + 1) }}
                  }
                </span>
                <span class="t-txt">
                  <small>{{ numero(i + 1) }}</small>
                  <strong>{{ p.nombre }}</strong>
                </span>
              </button>
            }
          </div>

          <!-- ===== Panel ===== -->
          <div class="panel" id="perfil-panel" role="tabpanel" [attr.aria-labelledby]="'perfil-tab-' + idx()"
               (pointerdown)="empezar($event)" (pointerup)="terminar($event)">

            <div class="media">
              @for (p of productos; track p.nombre; let i = $index) {
                <div class="capa" [class.on]="i === idx()" [attr.aria-hidden]="i !== idx()">
                  @if (p.imagen && !fallo(i)) {
                    <img [src]="p.imagen" [alt]="p.nombre" loading="lazy" (error)="falloImagen(i)">
                  } @else {
                    <span class="ph" aria-hidden="true">
                      <svg viewBox="0 0 24 24" width="80" height="80" fill="none" stroke="currentColor" stroke-width="1.3"
                           stroke-linecap="round" stroke-linejoin="round"><path d="M3 21V9l9-6 9 6v12"/><path d="M9 21v-6h6v6"/></svg>
                    </span>
                  }
                </div>
              }
              <span class="cont">{{ numero(idx() + 1) }} / {{ numero(productos.length) }}</span>
              @if (hayImagen()) {
                <button type="button" class="zoom" aria-label="Ampliar la foto" (click)="abrirFoto()">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2"
                       stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
                </button>
              }
            </div>

            @for (p of [actual()]; track p.nombre) {
              <div class="contenido">
                <h3>{{ p.nombre }}</h3>

                @if (intro()) {
                  @for (par of intro().split('\\n'); track $index) { <p class="intro">{{ par }}</p> }
                }
                @if (pares().length) {
                  <dl class="pares">
                    @for (pr of pares(); track pr.rotulo) {
                      <div class="par"><dt>{{ pr.rotulo }}</dt><dd>{{ pr.valor }}</dd></div>
                    }
                  </dl>
                }

                <div class="nav">
                  <button type="button" class="b" (click)="mover(-1)">‹ Anterior</button>
                  <button type="button" class="b" (click)="mover(1)">Siguiente ›</button>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </section>

    <!-- ===== Foto ampliada ===== -->
    <dialog #dlg class="lb" aria-label="Foto ampliada" (click)="cerrarFotoFuera($event)">
      <button type="button" class="lb-x" aria-label="Cerrar" (click)="cerrarFoto()">×</button>
      @if (actual().imagen) { <img [src]="actual().imagen" [alt]="actual().nombre"> }
    </dialog>
  `,
  styles: [`
    :host { display: block; }
    section { scroll-margin-top: calc(var(--header-h, 64px) + 8px); }

    /* ---------- Pestañas ---------- */
    .tabs { display: flex; flex-wrap: wrap; justify-content: center; gap: .75rem; margin-bottom: 1.75rem; }
    .tab { display: flex; align-items: center; gap: .7rem; padding: .4rem 1.15rem .4rem .4rem; text-align: left;
           background: var(--surface); border: 1px solid var(--line); border-radius: 999px; font: inherit; color: var(--ink);
           cursor: pointer; transition: background .25s, border-color .25s, color .25s, transform .25s, box-shadow .25s; }
    .tab:hover { transform: translateY(-2px); border-color: var(--brand); box-shadow: 0 8px 18px rgba(0,0,0,.08); }
    .thumb { flex: none; width: 44px; height: 44px; display: grid; place-items: center; overflow: hidden; border-radius: 50%;
             background: var(--band); font-size: .8rem; font-weight: 800; color: var(--brand); transition: box-shadow .25s; }
    .thumb img { width: 100%; height: 100%; object-fit: cover; }
    .t-txt small { display: block; font-size: .62rem; font-weight: 800; letter-spacing: .12em; color: var(--muted); }
    .t-txt strong { display: block; max-width: 22ch; font-size: .86rem; font-weight: 700; line-height: 1.25; }
    .tab.on { background: var(--brand); border-color: var(--brand); color: #fff; box-shadow: 0 10px 22px rgba(0,0,0,.16); }
    .tab.on small { color: rgba(255,255,255,.7); }
    .tab.on .thumb { box-shadow: 0 0 0 3px rgba(255,255,255,.85); }

    /* ---------- Panel ---------- */
    .panel { display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr); gap: clamp(1.5rem, 4vw, 2.75rem);
             align-items: center; padding: clamp(1.25rem, 3vw, 2rem); touch-action: pan-y; background: var(--surface);
             border: 1px solid var(--line); border-top: 3px solid var(--brand); border-radius: var(--radius);
             box-shadow: 0 1px 2px rgba(0,0,0,.05), 0 10px 28px rgba(0,0,0,.07); }

    .media { position: relative; aspect-ratio: 4 / 3; overflow: hidden; border-radius: 12px; background: var(--band); }
    .capa { position: absolute; inset: 0; opacity: 0; visibility: hidden; transform: scale(1.04);
            transition: opacity .6s ease, transform 1s ease, visibility 0s linear .6s; }
    .capa.on { opacity: 1; visibility: visible; transform: none; transition-delay: 0s; }
    .capa img { width: 100%; height: 100%; object-fit: cover; }
    .ph { width: 100%; height: 100%; display: grid; place-items: center; color: rgba(255,255,255,.55);
          background: linear-gradient(135deg, #b98a57, var(--wood)); }
    .cont { position: absolute; left: .8rem; bottom: .8rem; padding: .25rem .75rem; border-radius: 999px;
            background: rgba(255,255,255,.93); font-size: .74rem; font-weight: 800; letter-spacing: .04em;
            font-variant-numeric: tabular-nums; box-shadow: 0 4px 12px rgba(0,0,0,.15); }
    .zoom { position: absolute; top: .8rem; right: .8rem; width: 38px; height: 38px; display: grid; place-items: center; border: 0;
            border-radius: 50%; background: rgba(255,255,255,.92); color: var(--brand-dark); cursor: pointer;
            opacity: 0; transition: opacity .25s, transform .2s; }
    .media:hover .zoom, .zoom:focus-visible { opacity: 1; }
    .zoom:hover { transform: scale(1.1); }

    .contenido { animation: subir .5s ease; }
    @keyframes subir { from { opacity: 0; transform: translateY(14px); } }
    h3 { margin-bottom: 1rem; font-size: clamp(1.25rem, 2.4vw, 1.7rem); font-weight: 800; line-height: 1.2; text-transform: uppercase; }
    .intro { margin: 0 0 .9rem; font-size: .98rem; line-height: 1.8; color: var(--muted); }

    .pares { display: grid; gap: .7rem; margin: 0; }
    .par { padding: .7rem 1rem; border-left: 3px solid var(--brand); border-radius: 0 10px 10px 0; background: var(--bg);
           transition: transform .25s ease, background .25s ease; }
    .par:hover { transform: translateX(4px); background: color-mix(in srgb, var(--brand) 6%, var(--bg)); }
    dt { font-size: .68rem; font-weight: 800; letter-spacing: .09em; text-transform: uppercase; color: var(--wood); }
    dd { margin: .15rem 0 0; font-weight: 700; line-height: 1.45; color: var(--ink); }

    .nav { display: flex; gap: .6rem; margin-top: 1.5rem; padding-top: 1.1rem; border-top: 1px solid var(--line); }
    .b { padding: .6rem 1.1rem; background: none; border: 1px solid var(--line); border-radius: 4px; font: inherit;
         font-size: .85rem; font-weight: 600; color: var(--ink); cursor: pointer; transition: background .2s, border-color .2s; }
    .b:hover { background: var(--band); border-color: var(--brand); }

    /* ---------- Entrada ---------- */
    .perfil:not(.visible) .tab, .perfil:not(.visible) .panel { opacity: 0; }
    .perfil.visible .tab { animation: subir .5s ease backwards; animation-delay: calc(var(--i, 0) * .1s); }
    .perfil.visible .panel { animation: subir .6s .25s ease backwards; }

    /* ---------- Foto ampliada ---------- */
    .lb { width: min(1000px, 94vw); padding: 0; border: 0; border-radius: 14px; background: #111; overflow: hidden; }
    .lb::backdrop { background: rgba(10,12,14,.8); backdrop-filter: blur(6px); }
    .lb[open] { animation: aparece .25s ease; }
    @keyframes aparece { from { opacity: 0; transform: scale(.96); } }
    .lb img { display: block; width: 100%; max-height: 86vh; object-fit: contain; }
    .lb-x { position: absolute; top: .6rem; right: .7rem; width: 38px; height: 38px; border: 0; border-radius: 50%;
            background: rgba(255,255,255,.92); font-size: 1.6rem; line-height: 1; color: #111; cursor: pointer; }

    /* ---------- Responsive ---------- */
    @media (max-width: 860px) {
      .panel { grid-template-columns: 1fr; }
      .zoom { opacity: 1; }
    }
    @media (max-width: 560px) {
      .tabs { flex-wrap: nowrap; justify-content: flex-start; overflow-x: auto; scroll-snap-type: x proximity;
              margin-inline: -1.25rem; padding: .25rem 1.25rem .6rem; scrollbar-width: none; }
      .tabs::-webkit-scrollbar { display: none; }
      .tab { flex: none; scroll-snap-align: center; }
    }
  `],
})
export class ProductosGridComponent {
  productos = PRODUCTOS;

  idx = signal(0);
  visible = signal(false);
  private fallos = signal<number[]>([]);

  actual = computed(() => this.productos[this.idx()]);
  intro = computed(() => formatear(this.actual().descripcion).intro);
  pares = computed(() => formatear(this.actual().descripcion).pares);
  hayImagen = computed(() => !!this.actual().imagen && !this.fallos().includes(this.idx()));

  private dlg = viewChild.required<ElementRef<HTMLDialogElement>>('dlg');
  private host = inject(ElementRef<HTMLElement>);
  private destroyRef = inject(DestroyRef);
  private inicioX = 0;

  constructor() {
    afterNextRender(() => {
      if (!('IntersectionObserver' in window)) {
        this.visible.set(true);
        return;
      }
      const observer = new IntersectionObserver(
        ([entrada]) => {
          if (entrada.isIntersecting) {
            this.visible.set(true);
            observer.disconnect();
          }
        },
        { threshold: 0.15 },
      );
      observer.observe(this.host.nativeElement);
      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }

  numero(n: number): string {
    return String(n).padStart(2, '0');
  }

  ir(i: number): void {
    this.idx.set(i);
  }

  mover(dir: 1 | -1): void {
    const n = this.productos.length;
    this.idx.set((this.idx() + dir + n) % n);
  }

  /** Flechas, Inicio y Fin entre las pestañas. */
  teclas(ev: KeyboardEvent, i: number): void {
    const n = this.productos.length;
    let j: number;
    switch (ev.key) {
      case 'ArrowRight': case 'ArrowDown': j = (i + 1) % n; break;
      case 'ArrowLeft': case 'ArrowUp': j = (i - 1 + n) % n; break;
      case 'Home': j = 0; break;
      case 'End': j = n - 1; break;
      default: return;
    }
    ev.preventDefault();
    this.ir(j);
    setTimeout(() =>
      (this.host.nativeElement.querySelector('[role="tab"][aria-selected="true"]') as HTMLElement | null)?.focus(),
    );
  }

  // ---------- Deslizar con el dedo ----------
  empezar(ev: PointerEvent): void {
    this.inicioX = ev.clientX;
  }

  terminar(ev: PointerEvent): void {
    if (ev.pointerType === 'mouse') return;
    const dx = ev.clientX - this.inicioX;
    if (Math.abs(dx) > 60) this.mover(dx < 0 ? 1 : -1);
  }

  // ---------- Imágenes ----------
  fallo(i: number): boolean {
    return this.fallos().includes(i);
  }

  falloImagen(i: number): void {
    this.fallos.update((f) => [...f, i]);
  }

  abrirFoto(): void {
    const d = this.dlg().nativeElement;
    if (!d.open) d.showModal();
  }

  cerrarFoto(): void {
    this.dlg().nativeElement.close();
  }

  cerrarFotoFuera(ev: MouseEvent): void {
    if (ev.target === this.dlg().nativeElement) this.cerrarFoto();
  }
}

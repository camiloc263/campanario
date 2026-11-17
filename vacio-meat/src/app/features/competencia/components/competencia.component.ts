import { afterNextRender, Component, DestroyRef, ElementRef, inject, signal } from '@angular/core';
import {
  CABECERA, COLUMNAS_MATRIZ, COMPETIDORES, Competidor, CeldaMatriz, DIFERENCIAL,
  ESCALA_PRECIO, FILAS_MATRIZ, FilaMatriz, TITULO_MATRIZ,
} from '../data/competencia.data';

type Vista = 'tarjetas' | 'matriz';

@Component({
  selector: 'app-competencia',
  standalone: true,
  template: `
    <section class="section">
      <div class="wrap">
        <header class="cab">
          <h2>{{ cab.titulo }}</h2>
          <p>{{ cab.descripcion }}</p>
        </header>

        <!-- ===== Selector de vista ===== -->
        <div class="modos" role="group" [attr.aria-label]="cab.etiquetaModo">
          <span class="modos-etq"><i class="punto-v" aria-hidden="true"></i>{{ cab.etiquetaModo }}</span>
          <button type="button" class="chip" [class.on]="vista() === 'tarjetas'"
                  [attr.aria-pressed]="vista() === 'tarjetas'" (click)="vista.set('tarjetas')">
            {{ cab.tarjetas }}
          </button>
          <button type="button" class="chip" [class.on]="vista() === 'matriz'"
                  [attr.aria-pressed]="vista() === 'matriz'" (click)="vista.set('matriz')">
            {{ cab.matriz }}
          </button>
        </div>

        <div class="vista" [class.visible]="visible()">
          @if (vista() === 'tarjetas') {
            <!-- ===== Tarjetas de competidores ===== -->
            <div class="cards">
              @for (c of competidores; track c.numero; let i = $index) {
                <article class="card" [style.--i]="i">
                  <div class="card-cab">
                    <span class="tag">Competidor {{ c.numero }}</span>
                    <span class="ico">
                      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor"
                           stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        @switch (c.icono) {
                          @case ('tienda') {
                            <path d="M4 9l1-5h14l1 5"/>
                            <path d="M4 9a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0 2.7 2.7 0 0 0 5.3 0"/>
                            <path d="M5 12v8h14v-8M10 20v-5h4v5"/>
                          }
                          @case ('edificio') {
                            <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6M9 10h.01M15 10h.01M9 13h.01M15 13h.01"/>
                          }
                          @case ('ruta') {
                            <path d="M3 17h13M13 13l4 4-4 4"/><path d="M21 7H8M11 3L7 7l4 4"/>
                          }
                        }
                      </svg>
                    </span>
                  </div>

                  <h3>{{ c.nombre }}</h3>

                  <div class="precio">
                    <span class="etq">Precio registrado</span>
                    <strong>{{ c.precio }}</strong>

                    <div class="rango" aria-hidden="true">
                      <div class="rango-pista">
                        <span class="rango-barra" [style.left.%]="izq(c)" [style.width.%]="ancho(c)"></span>
                      </div>
                      <div class="rango-ejes">
                        <span>{{ moneda(escala.min) }}</span><span>{{ moneda(escala.max) }}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <span class="etq">Características</span>
                    <p>{{ c.caracteristicas }}</p>
                  </div>

                  <div class="brechas">
                    @for (b of c.brechas; track b.texto) {
                      <span class="brecha" [class]="'brecha ' + b.tono">{{ b.texto }}</span>
                    }
                  </div>
                </article>
              }
            </div>
          } @else {
            <!-- ===== Matriz comparativa ===== -->
            <div class="matriz">
              <div class="matriz-cab">
                <h3>{{ tituloMatriz.titulo }}</h3>
                <span>{{ tituloMatriz.subtitulo }}</span>
              </div>
              <div class="scroll" tabindex="0" role="region" aria-label="Tabla comparativa, desplazable">
                <table>
                  <thead>
                    <tr>
                      @for (col of columnas; track col) { <th scope="col">{{ col }}</th> }
                    </tr>
                  </thead>
                  <tbody>
                    @for (f of filas; track f.actor; let i = $index) {
                      <tr [class.propia]="f.propia" [style.--i]="i">
                        <th scope="row">{{ f.actor }}</th>
                        @for (c of celdas(f); track $index) {
                          <td [class]="'c-' + c.tipo">
                            <span class="celda">
                              @switch (c.tipo) {
                                @case ('si') {
                                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor"
                                       stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-label="Sí">
                                    <path d="M5 12l5 5 9-10"/>
                                  </svg>
                                }
                                @case ('no') {
                                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor"
                                       stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-label="No">
                                    <path d="M6 6l12 12M18 6L6 18"/>
                                  </svg>
                                }
                              }
                              {{ c.texto }}
                            </span>
                          </td>
                        }
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          }
        </div>

        <!-- ===== Diferencial ===== -->
        <article class="dif">
          <span class="insignia"><i aria-hidden="true"></i>{{ dif.insignia }}</span>
          <h3>{{ dif.titulo }}</h3>
          <p class="dif-texto">{{ dif.texto }}</p>

          <div class="pilares">
            @for (p of dif.pilares; track p.titulo) {
              <div class="pilar">
                <div class="pilar-cab">
                  <span class="pilar-ico">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor"
                         stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      @switch (p.icono) {
                        @case ('escudo') { <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/> }
                        @case ('ciclo') { <path d="M4 4v5h5M20 20v-5h-5"/><path d="M4.6 9a8 8 0 0 1 14-2.5M19.4 15a8 8 0 0 1-14 2.5"/> }
                        @case ('personas') {
                          <circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6"/>
                          <circle cx="17.5" cy="9" r="2.6"/><path d="M17 14.2c2.5 0 4.5 2 4.5 5"/>
                        }
                      }
                    </svg>
                  </span>
                  <span class="pilar-etq">{{ p.etiqueta }}</span>
                </div>
                <h4>{{ p.titulo }}</h4>
                <p>{{ p.texto }}</p>
              </div>
            }
          </div>
        </article>
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; --oro: #e6c79c; }

    .cab { text-align: center; margin-bottom: 1.75rem; }
    .cab h2 { font-size: clamp(1.4rem, 2.6vw, 1.9rem); font-weight: 800; text-transform: uppercase; margin-bottom: .7rem; }
    .cab p { margin: 0 auto; max-width: 62ch; color: var(--muted); font-size: .95rem; }

    /* ---------- Selector de vista ---------- */
    .modos { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: .6rem; margin-bottom: 1.75rem; }
    .modos-etq { display: inline-flex; align-items: center; gap: .5rem; margin-right: .3rem; font-size: .85rem;
                 font-weight: 700; color: var(--muted); }
    .punto-v { width: 8px; height: 8px; border-radius: 50%; background: var(--brand); }
    .chip { padding: .55rem 1.1rem; border-radius: 999px; border: 1px solid var(--line); background: var(--surface);
            font: inherit; font-size: .85rem; font-weight: 600; color: var(--muted); cursor: pointer;
            transition: background .2s, color .2s, border-color .2s, transform .15s; }
    .chip:hover { border-color: var(--brand); color: var(--brand); }
    .chip:active { transform: scale(.97); }
    .chip.on { background: var(--brand); border-color: var(--brand); color: #fff; }

    .vista { margin-bottom: 2rem; }
    .etq { display: block; margin-bottom: .25rem; font-size: .7rem; font-weight: 700; text-transform: uppercase;
           letter-spacing: .05em; color: var(--muted); }

    /* ---------- Tarjetas ---------- */
    .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 290px), 1fr)); gap: 1.25rem; align-items: stretch; }
    .card { display: flex; flex-direction: column; gap: 1rem; padding: 1.5rem; background: var(--surface);
            border: 1px solid var(--line); border-top: 3px solid var(--wood); border-radius: var(--radius);
            box-shadow: 0 1px 2px rgba(0,0,0,.05), 0 6px 18px rgba(0,0,0,.05);
            transition: transform .25s ease, box-shadow .25s ease; }
    .card:hover { transform: translateY(-3px); box-shadow: 0 2px 4px rgba(0,0,0,.06), 0 14px 30px rgba(0,0,0,.1); }
    .card-cab { display: flex; align-items: center; justify-content: space-between; gap: .5rem; }
    .tag { padding: .25rem .65rem; border-radius: 6px; background: var(--band); font-size: .7rem; font-weight: 800;
           text-transform: uppercase; letter-spacing: .05em; }
    .ico { width: 40px; height: 40px; display: grid; place-items: center; border-radius: 50%; color: var(--wood);
           background: color-mix(in srgb, var(--wood) 12%, transparent); transition: background .25s, color .25s; }
    .card:hover .ico { background: var(--wood); color: #fff; }
    .card h3 { font-size: 1.1rem; font-weight: 800; line-height: 1.3; }
    .card p { margin: 0; font-size: .9rem; line-height: 1.65; color: var(--muted); }

    .precio { padding: .9rem 1rem; border-radius: 10px; background: var(--bg); border: 1px solid var(--line); }
    .precio strong { display: block; font-size: .9rem; line-height: 1.4; color: var(--wood); }
    .rango { margin-top: .8rem; }
    .rango-pista { position: relative; height: 8px; border-radius: 999px; background: var(--band); }
    .rango-barra { position: absolute; top: 0; bottom: 0; border-radius: inherit; background: var(--wood);
                   transform-origin: left; animation: crecer .8s .3s ease backwards; }
    @keyframes crecer { from { transform: scaleX(0); } }
    .rango-ejes { display: flex; justify-content: space-between; margin-top: .3rem; font-size: .68rem; color: var(--muted); }

    .brechas { display: flex; flex-wrap: wrap; gap: .4rem; margin-top: auto; padding-top: 1rem; border-top: 1px solid var(--line); }
    .brecha { padding: .2rem .65rem; border-radius: 999px; font-size: .72rem; font-weight: 600; }
    .brecha.rojo { background: #fbeaea; color: #8f2420; }
    .brecha.ambar { background: #fdf3df; color: #7a5200; }
    .brecha.neutro { background: var(--band); color: var(--muted); }

    /* ---------- Matriz ---------- */
    .matriz { background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius); overflow: hidden;
              box-shadow: 0 1px 2px rgba(0,0,0,.05), 0 6px 18px rgba(0,0,0,.05); animation: subir .4s ease; }
    .matriz-cab { display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: .5rem;
                  padding: 1.1rem 1.4rem; background: var(--band); border-bottom: 1px solid var(--line); }
    .matriz-cab h3 { font-size: 1.05rem; font-weight: 800; }
    .matriz-cab span { font-size: .78rem; color: var(--muted); font-weight: 600; }
    .scroll { overflow-x: auto; }
    table { width: 100%; min-width: 700px; border-collapse: collapse; font-size: .85rem; text-align: left; }
    thead th { padding: 1rem 1.1rem; background: var(--bg); border-bottom: 1px solid var(--line); font-size: .78rem;
               font-weight: 800; text-transform: uppercase; letter-spacing: .03em; }
    tbody th, tbody td { padding: 1rem 1.1rem; border-bottom: 1px solid var(--line); vertical-align: middle; }
    tbody tr:last-child th, tbody tr:last-child td { border-bottom: 0; }
    tbody th { font-weight: 700; color: var(--ink); background: var(--surface); position: sticky; left: 0; min-width: 190px; }
    tbody tr { animation: subir .4s ease backwards; animation-delay: calc(var(--i, 0) * .07s); transition: background .2s; }
    tbody tr:hover td, tbody tr:hover th { background: color-mix(in srgb, var(--brand) 5%, var(--surface)); }
    tbody tr.propia td, tbody tr.propia th { background: color-mix(in srgb, #1b7f4b 10%, var(--surface)); }
    tbody tr.propia th { color: #1b7f4b; }
    .celda { display: inline-flex; align-items: center; gap: .45rem; }
    .c-si { color: #1b7f4b; font-weight: 600; }
    .c-no { color: #8a8a84; }
    .c-neutro { color: var(--muted); }
    @keyframes subir { from { opacity: 0; transform: translateY(12px); } }

    /* ---------- Diferencial ---------- */
    .dif { position: relative; overflow: hidden; padding: clamp(1.75rem, 4vw, 2.75rem); border-radius: var(--radius);
           background: var(--brand); color: #fff; box-shadow: 0 10px 30px rgba(0,0,0,.18); }
    .dif::before, .dif::after { content: ''; position: absolute; border-radius: 50%; pointer-events: none; }
    .dif::before { width: 260px; height: 260px; right: -80px; top: -80px;
                   background: radial-gradient(circle, rgba(230,199,156,.28), transparent 70%); }
    .dif::after { width: 220px; height: 220px; left: -70px; bottom: -70px;
                  background: radial-gradient(circle, rgba(200,125,85,.3), transparent 70%); }
    .dif > * { position: relative; z-index: 1; }
    .insignia { display: inline-flex; align-items: center; gap: .5rem; padding: .3rem .9rem; border-radius: 999px;
                background: rgba(230,199,156,.18); border: 1px solid rgba(230,199,156,.45); color: var(--oro);
                font-size: .72rem; font-weight: 800; text-transform: uppercase; letter-spacing: .06em; }
    .insignia i { width: 8px; height: 8px; border-radius: 50%; background: var(--oro); }
    .dif h3 { margin: 1rem 0; font-size: clamp(1.3rem, 2.8vw, 1.9rem); font-weight: 800; text-transform: uppercase; }
    .dif-texto { margin: 0 0 1.75rem; max-width: 80ch; font-size: 1rem; line-height: 1.75; color: rgba(255,255,255,.9); }

    .pilares { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr)); gap: 1rem; }
    .pilar { padding: 1.25rem; border-radius: 12px; background: rgba(255,255,255,.1); border: 1px solid rgba(230,199,156,.3);
             backdrop-filter: blur(4px); transition: transform .25s ease, background .25s ease; }
    .pilar:hover { transform: translateY(-4px); background: rgba(255,255,255,.16); }
    .pilar-cab { display: flex; align-items: center; justify-content: space-between; gap: .5rem; margin-bottom: .85rem; }
    .pilar-ico { width: 42px; height: 42px; display: grid; place-items: center; border-radius: 10px;
                 background: rgba(230,199,156,.2); color: var(--oro); }
    .pilar-etq { padding: .2rem .65rem; border-radius: 999px; background: rgba(230,199,156,.2); color: var(--oro);
                 font-size: .65rem; font-weight: 800; text-transform: uppercase; letter-spacing: .05em; }
    .pilar h4 { font-size: 1rem; font-weight: 700; margin-bottom: .35rem; }
    .pilar p { margin: 0; font-size: .85rem; line-height: 1.6; color: rgba(255,255,255,.85); }

    /* ---------- Entrada ---------- */
    .vista:not(.visible) .card { opacity: 0; }
    .vista.visible .card { animation: subir .5s ease backwards; animation-delay: calc(var(--i, 0) * .12s); }
  `],
})
export class CompetenciaComponent {
  cab = CABECERA;
  competidores = COMPETIDORES;
  columnas = COLUMNAS_MATRIZ;
  filas = FILAS_MATRIZ;
  tituloMatriz = TITULO_MATRIZ;
  dif = DIFERENCIAL;
  escala = ESCALA_PRECIO;

  vista = signal<Vista>('tarjetas');
  visible = signal(false);

  private host = inject(ElementRef<HTMLElement>);
  private destroyRef = inject(DestroyRef);

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
        { threshold: 0.12 },
      );
      observer.observe(this.host.nativeElement);
      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }

  celdas(f: FilaMatriz): CeldaMatriz[] {
    return [f.precio, f.vacio, f.canal, f.circular];
  }

  /** Posición izquierda de la barra de rango (%) dentro de la escala. */
  izq(c: Competidor): number {
    const { min, max } = this.escala;
    return ((c.precioMin - min) / (max - min)) * 100;
  }

  ancho(c: Competidor): number {
    const { min, max } = this.escala;
    return ((c.precioMax - c.precioMin) / (max - min)) * 100;
  }

  moneda(n: number): string {
    return '$' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
}

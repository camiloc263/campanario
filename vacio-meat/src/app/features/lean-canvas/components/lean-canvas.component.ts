import {
  afterNextRender, Component, DestroyRef, ElementRef, computed, inject, signal, viewChild,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import {
  BLOQUES, BloqueCanvas, CATEGORIAS, Categoria, FilaGrafico, GRAFICOS, GrupoGrafico,
  KPIS, Kpi, LEAN_CANVAS_DATA,
} from '../data/lean-canvas';

type Filtro = 'todos' | Categoria;

/** Quita acentos y mayúsculas sin cambiar la longitud del texto (sirve para resaltar coincidencias). */
const plano = (s: string): string =>
  Array.from(s).map((c) => c.normalize('NFD')[0].toLowerCase()).join('');

@Component({
  selector: 'app-lean-canvas',
  standalone: true,
  imports: [NgTemplateOutlet],
  template: `
    <!-- Íconos -->
    <ng-template #iconoTpl let-nombre let-tam="tam">
      <svg viewBox="0 0 24 24" [attr.width]="tam" [attr.height]="tam" fill="none" stroke="currentColor"
           stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        @switch (nombre) {
          @case ('alerta') { <path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18v.01"/> }
          @case ('idea') {
            <path d="M9 18h6M10 21h4"/>
            <path d="M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z"/>
          }
          @case ('metricas') {
            <path d="M4 20h16"/><rect x="6" y="11" width="3" height="9"/>
            <rect x="11" y="6" width="3" height="14"/><rect x="16" y="14" width="3" height="6"/>
          }
          @case ('valor') { <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/> }
          @case ('escudo') { <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/> }
          @case ('canales') { <path d="M3 17h13M13 13l4 4-4 4"/><path d="M21 7H8M11 3L7 7l4 4"/> }
          @case ('clientes') {
            <circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6"/>
            <circle cx="17.5" cy="9" r="2.6"/><path d="M17 14.2c2.5 0 4.5 2 4.5 5"/>
          }
          @case ('costos') {
            <ellipse cx="12" cy="6" rx="8" ry="3"/>
            <path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/>
          }
          @case ('tendencia') { <path d="M3 17l6-6 4 4 8-8"/><path d="M14 7h7v7"/> }
          @case ('paquete') { <path d="M21 8l-9-5-9 5v8l9 5 9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/> }
          @case ('casa') { <path d="M3 11l9-7 9 7v9H3z"/><path d="M9 20v-6h6v6"/> }
          @case ('calendario') { <rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/> }
        }
      </svg>
    </ng-template>

    <!-- Texto con coincidencias resaltadas -->
    <ng-template #resaltado let-texto>
      @for (p of partes(texto); track $index) {
        @if (p.m) { <mark>{{ p.t }}</mark> } @else { {{ p.t }} }
      }
    </ng-template>

    <section class="section">
      <div class="wrap">

        <header class="cab">
          <span class="kicker">{{ d.marca }} · {{ d.eslogan }}</span>
          <h2>{{ d.titulo }}</h2>
          <p>{{ d.subtitulo }}</p>
        </header>

        <!-- ===== Cifras clave ===== -->
        <ul class="kpis">
          @for (k of kpis; track k.rotulo; let i = $index) {
            <li class="kpi" [style.--i]="i">
              <span class="kpi-ico">
                <ng-container [ngTemplateOutlet]="iconoTpl" [ngTemplateOutletContext]="{ $implicit: k.icono, tam: 22 }" />
              </span>
              <strong>{{ valorKpi(k) }}</strong>
              <span class="kpi-rot">{{ k.rotulo }}</span>
            </li>
          }
        </ul>

        <!-- ===== Herramientas ===== -->
        <div class="tools">
          <div class="busca">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"
                 stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>
            </svg>
            <label class="sr-only" for="lc-busca">Buscar en el canvas</label>
            <input id="lc-busca" type="search" placeholder="Buscar en el canvas: empacado, WhatsApp, compostaje…"
                   [value]="consulta()" (input)="consulta.set($any($event.target).value)">
            @if (consulta()) {
              <button type="button" class="limpiar" aria-label="Borrar búsqueda" (click)="consulta.set('')">×</button>
            }
          </div>

          <div class="filtros" role="group" aria-label="Filtrar por categoría">
            <button type="button" class="chip" [class.on]="filtro() === 'todos'"
                    [attr.aria-pressed]="filtro() === 'todos'" (click)="filtro.set('todos')">
              Todos los bloques ({{ bloques.length }})
            </button>
            @for (c of categorias; track c.id) {
              <button type="button" class="chip" [class.on]="filtro() === c.id"
                      [attr.aria-pressed]="filtro() === c.id" [style.--c]="c.color" (click)="filtro.set(c.id)">
                <i class="pto" aria-hidden="true"></i>{{ c.etiqueta }} ({{ cuenta(c.id) }})
              </button>
            }
          </div>

          <div class="acciones">
            <button type="button" class="chip suave" [attr.aria-pressed]="completa()" (click)="completa.set(!completa())">
              {{ completa() ? 'Vista compacta' : 'Ver texto completo' }}
            </button>
            <button type="button" class="chip suave" (click)="abrir(bloques[0])">Recorrer paso a paso ›</button>
          </div>
        </div>

        <p class="estado" aria-live="polite">
          @if (hayFiltro()) {
            {{ activos() }} de {{ bloques.length }} bloques coinciden
            @if (activos() === 0) { · prueba con otra palabra o quita el filtro }
          } @else {
            Haz clic en un bloque para ver su detalle
          }
        </p>

        <!-- ===== Canvas ===== -->
        <div class="canvas" [class.compacta]="!completa()" [class.visible]="visible()">
          @for (b of bloques; track b.id) {
            <article [class]="clases(b)" [style.--i]="b.numero" (click)="abrir(b)">
              <header class="b-cab">
                <span class="num">{{ b.numero }}</span>
                <h3>{{ b.titulo }}</h3>
                <span class="b-ico">
                  <ng-container [ngTemplateOutlet]="iconoTpl" [ngTemplateOutletContext]="{ $implicit: b.icono, tam: 18 }" />
                </span>
              </header>

              <ul class="b-lista">
                @for (it of visibles(b); track $index) {
                  <li><ng-container [ngTemplateOutlet]="resaltado" [ngTemplateOutletContext]="{ $implicit: it }" /></li>
                }
              </ul>

              <div class="b-pie">
                @if (ocultos(b) > 0) { <span class="mas">+{{ ocultos(b) }} más</span> }
                <button type="button" class="ver">Ver detalle</button>
              </div>
            </article>
          }
        </div>
      </div>
    </section>

    <!-- ===== Ventana de detalle ===== -->
    <dialog #dialogo class="dialogo" aria-labelledby="dlg-titulo"
            (click)="cerrarFuera($event)" (close)="sel.set(null)">
      @if (sel(); as s) {
        <div class="dlg" [style.--acento]="color(s)">
          <button type="button" class="cerrar" aria-label="Cerrar" (click)="cerrar()">×</button>

          <div class="dlg-cab">
            <span class="dlg-ico">
              <ng-container [ngTemplateOutlet]="iconoTpl" [ngTemplateOutletContext]="{ $implicit: s.icono, tam: 32 }" />
            </span>
            <div>
              <span class="badge">Bloque {{ s.numero }} · {{ etiquetaCat(s) }}</span>
              <h3 id="dlg-titulo">{{ s.titulo }}</h3>
            </div>
          </div>

          <ul class="checks">
            @for (it of s.items; track $index) {
              <li><span><ng-container [ngTemplateOutlet]="resaltado" [ngTemplateOutletContext]="{ $implicit: it }" /></span></li>
            }
          </ul>

          @for (g of graficos(s); track g.titulo) {
            <div class="graf">
              <h4>{{ g.titulo }}</h4>
              @for (f of g.filas; track f.rotulo; let i = $index) {
                <div class="fila">
                  <div class="fila-top"><span>{{ f.rotulo }}</span><strong>{{ moneda(f.valor) }}</strong></div>
                  <div class="pista">
                    <span class="barra" [style.width.%]="pct(g, f)" [style.animation-delay.ms]="i * 120"></span>
                  </div>
                  @if (f.detalle) { <small>{{ f.detalle }}</small> }
                </div>
              }
              @if (g.total) {
                <div class="total"><span>{{ g.totalRotulo }}</span><strong>{{ moneda(g.total) }}</strong></div>
              }
            </div>
          }

          <div class="dlg-nav">
            <button type="button" class="nav" (click)="navegar(-1)">‹ Anterior</button>
            <span class="pos">{{ posicion() }} de {{ bloques.length }}</span>
            <button type="button" class="nav" (click)="navegar(1)">Siguiente ›</button>
            <button type="button" class="sec" (click)="cerrar()">Cerrar</button>
          </div>
        </div>
      }
    </dialog>
  `,
  styles: [`
    :host { display: block; }

    /* ---------- Encabezado ---------- */
    .cab { display: grid; justify-items: center; gap: .7rem; margin-bottom: 2rem; text-align: center; }
    .kicker { padding: .3rem .9rem; border-radius: 999px; background: var(--surface); border: 1px solid var(--line);
              font-size: .72rem; font-weight: 700; letter-spacing: .05em; text-transform: uppercase; color: var(--muted); }
    .cab h2 { font-size: clamp(1.5rem, 3vw, 2.1rem); font-weight: 800; text-transform: uppercase; }
    .cab p { margin: 0; color: var(--muted); font-size: .95rem; }

    /* ---------- Cifras clave ---------- */
    .kpis { list-style: none; margin: 0 0 1.75rem; padding: 0; display: grid; gap: .8rem;
            grid-template-columns: repeat(auto-fit, minmax(min(100%, 170px), 1fr)); }
    .kpi { display: grid; gap: .25rem; padding: 1rem 1.1rem; background: var(--surface); border: 1px solid var(--line);
           border-radius: var(--radius); box-shadow: 0 1px 2px rgba(0,0,0,.05);
           transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease; }
    .kpi:hover { transform: translateY(-3px); border-color: var(--brand); box-shadow: 0 10px 22px rgba(0,0,0,.09); }
    .kpi-ico { width: 36px; height: 36px; display: grid; place-items: center; border-radius: 50%; margin-bottom: .2rem;
               color: var(--wood); background: color-mix(in srgb, var(--wood) 12%, transparent); transition: background .25s, color .25s; }
    .kpi:hover .kpi-ico { background: var(--brand); color: #fff; }
    .kpi strong { font-size: 1.45rem; font-weight: 800; line-height: 1.1; color: var(--ink); font-variant-numeric: tabular-nums; }
    .kpi-rot { font-size: .75rem; font-weight: 600; line-height: 1.35; color: var(--muted); }

    /* ---------- Herramientas ---------- */
    .tools { display: grid; gap: .9rem; }
    .busca { position: relative; display: flex; align-items: center; max-width: 560px; width: 100%; margin-inline: auto;
             padding: 0 .9rem; background: var(--surface); border: 1px solid var(--line); border-radius: 999px; color: var(--muted);
             transition: border-color .2s, box-shadow .2s; }
    .busca:focus-within { border-color: var(--brand); box-shadow: 0 0 0 3px color-mix(in srgb, var(--brand) 18%, transparent); }
    .busca input { flex: 1; min-width: 0; padding: .75rem .6rem; border: 0; outline: 0; background: none; font: inherit;
                   font-size: .9rem; color: var(--ink); }
    .limpiar { border: 0; background: none; font-size: 1.4rem; line-height: 1; color: var(--muted); cursor: pointer; }
    .limpiar:hover { color: var(--ink); }

    .filtros, .acciones { display: flex; flex-wrap: wrap; justify-content: center; gap: .55rem; }
    .chip { --c: var(--brand); display: inline-flex; align-items: center; gap: .45rem; padding: .5rem 1rem; border-radius: 999px;
            border: 1px solid var(--line); background: var(--surface); font: inherit; font-size: .82rem; font-weight: 600;
            color: var(--muted); cursor: pointer; transition: background .2s, color .2s, border-color .2s, transform .15s; }
    .chip:hover { border-color: var(--c); color: var(--c); }
    .chip:active { transform: scale(.97); }
    .chip.on { background: var(--c); border-color: var(--c); color: #fff; }
    .chip .pto { width: 8px; height: 8px; border-radius: 50%; background: var(--c); }
    .chip.on .pto { background: #fff; }
    .chip.suave { background: transparent; }
    .chip.suave[aria-pressed='true'] { background: var(--ink); border-color: var(--ink); color: #fff; }

    .estado { margin: 1rem 0 1.25rem; text-align: center; font-size: .8rem; color: var(--muted); min-height: 1.2em; }

    /* ---------- Canvas ---------- */
    .canvas { display: grid; gap: .9rem; grid-template-columns: repeat(2, minmax(0, 1fr)); align-items: stretch; }
    .b-ventaja { grid-column: 1 / -1; }
    @media (min-width: 1101px) {
      .canvas { grid-template-columns: repeat(10, minmax(0, 1fr)); }
      .b-problema  { grid-column: 1 / span 2; grid-row: 1 / span 2; }
      .b-solucion  { grid-column: 3 / span 2; grid-row: 1; }
      .b-metricas  { grid-column: 3 / span 2; grid-row: 2; }
      .b-propuesta { grid-column: 5 / span 2; grid-row: 1 / span 2; }
      .b-ventaja   { grid-column: 7 / span 2; grid-row: 1; }
      .b-canales   { grid-column: 7 / span 2; grid-row: 2; }
      .b-segmento  { grid-column: 9 / span 2; grid-row: 1 / span 2; }
      .b-costos    { grid-column: 1 / span 5; grid-row: 3; }
      .b-ingresos  { grid-column: 6 / span 5; grid-row: 3; }
    }
    @media (max-width: 650px) { .canvas { grid-template-columns: 1fr; } }

    .bloque { --c: var(--brand); position: relative; display: flex; flex-direction: column; gap: .75rem; padding: 1rem;
              cursor: pointer; background: var(--surface); border: 1px solid var(--line); border-top: 3px solid var(--c);
              border-radius: var(--radius); box-shadow: 0 1px 2px rgba(0,0,0,.05);
              transition: transform .25s ease, box-shadow .25s ease, opacity .3s ease, filter .3s ease, border-color .25s ease; }
    .bloque:hover { transform: translateY(-3px); border-color: var(--c);
                    box-shadow: 0 2px 4px rgba(0,0,0,.06), 0 14px 28px rgba(0,0,0,.1); }
    .cat-mercado { --c: var(--brand); }
    .cat-operacion { --c: #1b7f4b; }
    .cat-finanzas { --c: var(--wood); }
    .bloque.dest { background: color-mix(in srgb, var(--c) 6%, var(--surface));
                   box-shadow: 0 0 0 1px color-mix(in srgb, var(--c) 40%, transparent), 0 6px 18px rgba(0,0,0,.07); }
    .bloque.dim { opacity: .28; filter: saturate(.3); }
    .bloque.dim:hover { opacity: .7; }

    .b-cab { display: flex; align-items: center; gap: .55rem; padding-bottom: .65rem; border-bottom: 1px solid var(--line); }
    .num { flex: none; width: 24px; height: 24px; display: grid; place-items: center; border-radius: 50%;
           background: var(--c); color: #fff; font-size: .75rem; font-weight: 800; }
    .b-cab h3 { flex: 1; font-size: .74rem; font-weight: 800; text-transform: uppercase; letter-spacing: .05em; line-height: 1.3; }
    .b-ico { flex: none; width: 30px; height: 30px; display: grid; place-items: center; border-radius: 50%;
             color: var(--c); background: color-mix(in srgb, var(--c) 12%, transparent); transition: background .25s, color .25s; }
    .bloque:hover .b-ico { background: var(--c); color: #fff; }

    .b-lista { list-style: none; margin: 0; padding: 0; display: grid; gap: .6rem; }
    .b-lista li { position: relative; padding-left: .9rem; font-size: .8rem; line-height: 1.5; color: var(--muted); }
    .b-lista li::before { content: ''; position: absolute; left: 0; top: .55em; width: 5px; height: 5px; border-radius: 50%; background: var(--c); }
    .compacta .b-lista li { display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 4; line-clamp: 4; overflow: hidden; }

    .b-pie { display: flex; align-items: center; justify-content: space-between; gap: .5rem; margin-top: auto; padding-top: .25rem; }
    .mas { padding: .1rem .55rem; border-radius: 999px; background: var(--band); font-size: .7rem; font-weight: 700; color: var(--muted); }
    .ver { margin-left: auto; padding: .2rem 0; background: none; border: 0; font: inherit; font-size: .8rem; font-weight: 700;
           color: var(--c); cursor: pointer; }
    .ver::after { content: ' ›'; }
    .bloque:hover .ver { text-decoration: underline; }

    mark { padding: 0 .12em; border-radius: 3px; background: #ffe98a; color: inherit; }

    /* ---------- Entrada ---------- */
    .canvas:not(.visible) .bloque { opacity: 0; }
    .canvas.visible .bloque { animation: subir .5s ease backwards; animation-delay: calc(var(--i, 0) * .06s); }
    @keyframes subir { from { opacity: 0; transform: translateY(16px); } }

    /* ---------- Ventana de detalle ---------- */
    .dialogo { border: 0; border-radius: 12px; padding: 0; width: min(640px, 92vw); overflow: hidden;
               color: var(--ink); box-shadow: 0 20px 60px rgba(0,0,0,.35); }
    .dialogo::backdrop { background: rgba(20,20,20,.55); }
    .dialogo[open] { animation: entrar .25s ease; }
    @keyframes entrar { from { opacity: 0; transform: translateY(12px) scale(.98); } }

    .dlg { --acento: var(--brand); position: relative; display: grid; gap: 1.1rem; padding: 1.75rem; max-height: 88vh;
           overflow-y: auto; border-top: 4px solid var(--acento); }
    .cerrar { position: absolute; top: .6rem; right: .8rem; width: 36px; height: 36px; border: 0; border-radius: 50%;
              background: none; font-size: 1.7rem; line-height: 1; color: var(--muted); cursor: pointer; }
    .cerrar:hover { background: var(--band); color: var(--ink); }
    .dlg-cab { display: flex; gap: 1rem; align-items: center; padding-right: 2rem; }
    .dlg-ico { flex: none; width: 60px; height: 60px; display: grid; place-items: center; border-radius: 50%;
               color: var(--acento); background: color-mix(in srgb, var(--acento) 12%, transparent); }
    .badge { display: inline-block; padding: .15rem .55rem; border-radius: 3px; background: var(--acento); color: #fff;
             font-size: .7rem; font-weight: 700; text-transform: uppercase; letter-spacing: .03em; }
    .dlg-cab h3 { margin-top: .3rem; font-size: 1.25rem; font-weight: 800; line-height: 1.25; }

    .checks { list-style: none; margin: 0; padding: 0; display: grid; gap: .75rem; }
    .checks li { display: flex; gap: .65rem; align-items: flex-start; font-size: .92rem; line-height: 1.6; color: var(--muted); }
    .checks li::before {
      content: ''; flex: none; width: 18px; height: 18px; margin-top: .2rem; border-radius: 50%;
      background: var(--acento) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 12l5 5 9-10'/%3E%3C/svg%3E") center / 11px no-repeat;
    }

    .graf { display: grid; gap: .85rem; padding: 1.1rem 1.2rem; border-radius: 10px; background: var(--bg); border: 1px solid var(--line); }
    .graf h4 { font-size: .75rem; font-weight: 800; text-transform: uppercase; letter-spacing: .05em; color: var(--muted); }
    .fila { display: grid; gap: .3rem; }
    .fila-top { display: flex; justify-content: space-between; gap: 1rem; font-size: .88rem; }
    .fila-top span { color: var(--ink); font-weight: 600; }
    .fila-top strong { font-variant-numeric: tabular-nums; color: var(--acento); }
    .pista { height: 10px; border-radius: 999px; background: var(--band); overflow: hidden; }
    .barra { display: block; height: 100%; border-radius: inherit; background: var(--acento); transform-origin: left;
             animation: crecer .8s ease backwards; }
    @keyframes crecer { from { transform: scaleX(0); } }
    .fila small { font-size: .75rem; line-height: 1.45; color: var(--muted); }
    .total { display: flex; justify-content: space-between; gap: 1rem; padding-top: .7rem; border-top: 1px dashed var(--line);
             font-size: .88rem; font-weight: 700; }
    .total strong { color: var(--ink); font-variant-numeric: tabular-nums; }

    .dlg-nav { display: flex; flex-wrap: wrap; gap: .6rem; align-items: center; margin-top: .25rem; padding-top: 1rem;
               border-top: 1px solid var(--line); }
    .pos { font-size: .8rem; font-weight: 600; color: var(--muted); }
    .nav, .sec { padding: .65rem 1rem; background: none; border: 1px solid var(--line); border-radius: 4px; font: inherit;
                 font-size: .85rem; font-weight: 600; cursor: pointer; }
    .nav:hover, .sec:hover { background: var(--band); }
    .sec { margin-left: auto; }
  `],
})
export class LeanCanvasComponent {
  d = LEAN_CANVAS_DATA;
  bloques = BLOQUES;
  categorias = CATEGORIAS;
  kpis = KPIS;
  readonly limite = 2;

  filtro = signal<Filtro>('todos');
  consulta = signal('');
  completa = signal(false);
  visible = signal(false);
  progreso = signal(0);
  sel = signal<BloqueCanvas | null>(null);

  /** Texto buscado, sin acentos (vacío si tiene menos de 2 letras). */
  private q = computed(() => {
    const t = plano(this.consulta().trim());
    return t.length >= 2 ? t : '';
  });
  hayFiltro = computed(() => this.filtro() !== 'todos' || this.q() !== '');
  activos = computed(() => BLOQUES.filter((b) => !this.atenuado(b)).length);
  posicion = computed(() => {
    const s = this.sel();
    return s ? BLOQUES.findIndex((b) => b.id === s.id) + 1 : 0;
  });

  private dialogo = viewChild.required<ElementRef<HTMLDialogElement>>('dialogo');
  private host = inject(ElementRef<HTMLElement>);
  private destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      if (!('IntersectionObserver' in window)) {
        this.visible.set(true);
        this.progreso.set(1);
        return;
      }
      const observer = new IntersectionObserver(
        ([entrada]) => {
          if (entrada.isIntersecting) {
            this.visible.set(true);
            this.animarCifras();
            observer.disconnect();
          }
        },
        { threshold: 0.1 },
      );
      observer.observe(this.host.nativeElement);
      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }

  // ---------- Filtros y búsqueda ----------
  cuenta(c: Categoria): number {
    return BLOQUES.filter((b) => b.categoria === c).length;
  }

  private coincide(b: BloqueCanvas): boolean {
    const q = this.q();
    return !q || plano(`${b.titulo} ${b.items.join(' ')}`).includes(q);
  }

  atenuado(b: BloqueCanvas): boolean {
    const categoriaOk = this.filtro() === 'todos' || b.categoria === this.filtro();
    return !(categoriaOk && this.coincide(b));
  }

  clases(b: BloqueCanvas): string {
    return `bloque b-${b.id} cat-${b.categoria}` + (b.destacado ? ' dest' : '') + (this.atenuado(b) ? ' dim' : '');
  }

  /** Divide un texto para resaltar lo que se está buscando. */
  partes(texto: string): { t: string; m: boolean }[] {
    const q = this.q();
    if (!q) return [{ t: texto, m: false }];
    const p = plano(texto);
    const out: { t: string; m: boolean }[] = [];
    let i = 0;
    for (; ;) {
      const j = p.indexOf(q, i);
      if (j < 0) break;
      if (j > i) out.push({ t: texto.slice(i, j), m: false });
      out.push({ t: texto.slice(j, j + q.length), m: true });
      i = j + q.length;
    }
    if (i < texto.length) out.push({ t: texto.slice(i), m: false });
    return out.length ? out : [{ t: texto, m: false }];
  }

  // ---------- Vista compacta / completa ----------
  visibles(b: BloqueCanvas): string[] {
    return this.completa() ? b.items : b.items.slice(0, this.limite);
  }

  ocultos(b: BloqueCanvas): number {
    return this.completa() ? 0 : Math.max(0, b.items.length - this.limite);
  }

  // ---------- Cifras ----------
  private animarCifras(): void {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.progreso.set(1);
      return;
    }
    const duracion = 1500;
    const inicio = performance.now();
    const paso = (t: number) => {
      const p = Math.min(1, (t - inicio) / duracion);
      this.progreso.set(1 - Math.pow(1 - p, 3));
      if (p < 1) requestAnimationFrame(paso);
    };
    requestAnimationFrame(paso);
  }

  valorKpi(k: Kpi): string {
    if (k.texto) return k.texto;
    const n = Math.round((k.valor ?? 0) * this.progreso());
    return `${k.prefijo ?? ''}${this.miles(n)}${k.sufijo ?? ''}`;
  }

  miles(n: number): string {
    return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  moneda(n: number): string {
    return '$' + this.miles(n);
  }

  // ---------- Detalle ----------
  graficos(b: BloqueCanvas): GrupoGrafico[] {
    return GRAFICOS[b.id] ?? [];
  }

  pct(g: GrupoGrafico, f: FilaGrafico): number {
    const base = g.total ?? Math.max(...g.filas.map((x) => x.valor));
    return (f.valor / base) * 100;
  }

  color(b: BloqueCanvas): string {
    return CATEGORIAS.find((c) => c.id === b.categoria)?.color ?? 'var(--brand)';
  }

  etiquetaCat(b: BloqueCanvas): string {
    return CATEGORIAS.find((c) => c.id === b.categoria)?.etiqueta ?? '';
  }

  abrir(b: BloqueCanvas): void {
    this.sel.set(b);
    const dlg = this.dialogo().nativeElement;
    if (!dlg.open) dlg.showModal();
  }

  navegar(dir: 1 | -1): void {
    const actual = this.sel();
    if (!actual) return;
    const n = BLOQUES.length;
    const i = (BLOQUES.findIndex((b) => b.id === actual.id) + dir + n) % n;
    this.sel.set(BLOQUES[i]);
  }

  cerrar(): void {
    this.dialogo().nativeElement.close();
  }

  cerrarFuera(ev: MouseEvent): void {
    if (ev.target === this.dialogo().nativeElement) this.cerrar();
  }
}

import { afterNextRender, Component, DestroyRef, ElementRef, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  CABECERA, ESTUDIO, FILTROS, IdFiltro, SEGMENTOS,
} from '../data/mercado.data';

@Component({
  selector: 'app-mercado-objetivo',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="section">
      <div class="wrap">
        <header class="cab">
          <h2>{{ cab.titulo }}</h2>
          <p>{{ cab.descripcion }}</p>
        </header>

        <!-- ===== Filtros ===== -->
        <div class="filtros" role="group" aria-label="Filtrar segmentos">
          <span class="filtros-etq">{{ cab.etiquetaFiltros }}</span>
          @for (f of filtros; track f.id) {
            <button type="button" class="chip" [class.on]="filtro() === f.id"
                    [attr.aria-pressed]="filtro() === f.id" (click)="filtro.set(f.id)">
              {{ f.texto }}
            </button>
          }
        </div>
        <p class="cuenta" aria-live="polite">
          Mostrando {{ visibles().length }} de {{ segmentos.length }} segmentos
        </p>

        <!-- ===== Segmentos ===== -->
        <div class="grid" [class.visible]="visible()" [class.uno]="visibles().length === 1">
          @for (s of visibles(); track s.id; let i = $index) {
            <article class="seg" [class]="'seg ' + s.id" [style.--i]="i">
              <span class="badge">{{ s.etiqueta }}</span>
              <h3>{{ s.titulo }}</h3>
              <p class="desc">{{ s.descripcion }}</p>

              <ul class="items">
                @for (it of s.items; track it.rotulo) {
                  <li class="item">
                    <span class="ico">
                      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor"
                           stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        @switch (it.icono) {
                          @case ('hogar') { <path d="M3 11l9-7 9 7v9H3z"/><path d="M9 20v-6h6v6"/> }
                          @case ('trabajo') {
                            <rect x="3" y="7" width="18" height="13" rx="2"/>
                            <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18"/>
                          }
                          @case ('familias') {
                            <circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6"/>
                            <circle cx="17.5" cy="9" r="2.6"/><path d="M17 14.2c2.5 0 4.5 2 4.5 5"/>
                          }
                          @case ('edad') {
                            <rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>
                          }
                          @case ('tienda') {
                            <path d="M4 9l1-5h14l1 5"/>
                            <path d="M4 9a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0 2.7 2.7 0 0 0 5.3 0"/>
                            <path d="M5 12v8h14v-8M10 20v-5h4v5"/>
                          }
                          @case ('carrito') {
                            <circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/>
                            <path d="M2 3h3l2.6 12.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 7H6"/>
                          }
                          @case ('restaurante') {
                            <path d="M6 3v8a2 2 0 0 0 2 2v8M10 3v8a2 2 0 0 1-2 2M8 3v6"/>
                            <path d="M17 3c-2 1.5-3 4-3 7 0 1.5 1 2.5 3 2.5V21"/>
                          }
                          @case ('mapa') {
                            <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"/>
                            <circle cx="12" cy="9.5" r="2.5"/>
                          }
                        }
                      </svg>
                    </span>
                    <div>
                      <strong>{{ it.rotulo }}</strong>
                      <span>{{ it.texto }}</span>
                    </div>
                  </li>
                }
              </ul>
            </article>
          }
        </div>
      </div>
    </section>

    <!-- ===== Estudio de mercado ===== -->
    <section class="estudio">
      <div class="wrap estudio-in">
        <div>
          <span class="kicker">{{ estudio.kicker }}</span>
          <h3>{{ estudio.titulo }}</h3>
          <p>{{ estudio.texto }}</p>
        </div>
        <a class="btn-claro" [routerLink]="[]" [fragment]="estudio.fragmento">{{ estudio.boton }}</a>
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; --oro: #e6c79c; }

    .cab { text-align: center; margin-bottom: 1.75rem; }
    .cab h2 { font-size: clamp(1.4rem, 2.6vw, 1.9rem); font-weight: 800; text-transform: uppercase; margin-bottom: .7rem; }
    .cab p { margin: 0 auto; max-width: 62ch; color: var(--muted); font-size: .95rem; }

    /* ---------- Filtros ---------- */
    .filtros { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: .6rem; }
    .filtros-etq { font-size: .85rem; font-weight: 700; color: var(--muted); margin-right: .2rem; }
    .chip { padding: .55rem 1.1rem; border-radius: 999px; border: 1px solid var(--line); background: var(--surface);
            font: inherit; font-size: .85rem; font-weight: 600; color: var(--muted); cursor: pointer;
            transition: background .2s, color .2s, border-color .2s, transform .15s; }
    .chip:hover { border-color: var(--brand); color: var(--brand); }
    .chip:active { transform: scale(.97); }
    .chip.on { background: var(--brand); border-color: var(--brand); color: #fff; }
    .cuenta { margin: .9rem 0 1.5rem; text-align: center; font-size: .78rem; color: var(--muted); }

    /* ---------- Segmentos ---------- */
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr)); gap: 1.5rem; align-items: stretch; }
    .seg { --acento: var(--brand); display: flex; flex-direction: column; gap: 1rem; padding: 1.75rem;
           background: var(--surface); border: 1px solid var(--line); border-top: 4px solid var(--acento);
           border-radius: var(--radius); box-shadow: 0 1px 2px rgba(0,0,0,.05), 0 6px 18px rgba(0,0,0,.05);
           transition: transform .25s ease, box-shadow .25s ease; }
    .seg.b2b { --acento: var(--wood); }
    .seg:hover { transform: translateY(-3px); box-shadow: 0 2px 4px rgba(0,0,0,.06), 0 14px 30px rgba(0,0,0,.1); }

    .badge { align-self: flex-start; padding: .25rem .75rem; border-radius: 999px; font-size: .7rem; font-weight: 700;
             text-transform: uppercase; letter-spacing: .03em; color: var(--acento);
             background: color-mix(in srgb, var(--acento) 12%, transparent); }
    .seg h3 { font-size: 1.2rem; font-weight: 800; text-transform: uppercase; }
    .desc { margin: 0; font-size: .92rem; line-height: 1.7; color: var(--muted); }

    .items { list-style: none; margin: auto 0 0; padding: 0; display: grid; gap: .6rem; }
    .grid.uno .items { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .item { display: flex; align-items: center; gap: .8rem; padding: .65rem .8rem; border: 1px solid var(--line);
            border-radius: 8px; background: var(--bg);
            transition: border-color .2s, background .2s, transform .2s; }
    .item:hover { border-color: var(--acento); transform: translateX(3px); }
    .item strong { display: block; font-size: .88rem; color: var(--ink); line-height: 1.3; }
    .item span { font-size: .8rem; color: var(--muted); }
    .ico { flex: none; width: 40px; height: 40px; display: grid; place-items: center; border-radius: 50%;
           color: var(--acento); background: color-mix(in srgb, var(--acento) 12%, transparent);
           transition: background .2s, color .2s; }
    .item:hover .ico { background: var(--acento); color: #fff; }

    /* ---------- Entrada ---------- */
    .grid:not(.visible) .seg { opacity: 0; }
    .grid.visible .seg { animation: subir .5s ease backwards; animation-delay: calc(var(--i, 0) * .12s); }
    @keyframes subir { from { opacity: 0; transform: translateY(18px); } }

    /* ---------- Estudio de mercado ---------- */
    .estudio { background: var(--brand-dark); color: #fff; padding-block: 2.75rem; }
    .estudio-in { display: flex; align-items: center; justify-content: space-between; gap: 2rem; flex-wrap: wrap; }
    .estudio-in > div { flex: 1 1 420px; max-width: 70ch; }
    .kicker { display: block; margin-bottom: .5rem; font-size: .75rem; font-weight: 700; letter-spacing: .08em;
              text-transform: uppercase; color: var(--oro); }
    .estudio h3 { font-size: 1.4rem; font-weight: 800; margin-bottom: .6rem; }
    .estudio p { margin: 0; font-size: .95rem; line-height: 1.7; color: rgba(255,255,255,.82); }
    .btn-claro { display: inline-block; padding: .9rem 1.8rem; border-radius: 4px; background: #fff; color: var(--brand-dark);
                 font-size: .85rem; font-weight: 700; text-transform: uppercase; letter-spacing: .04em; text-decoration: none;
                 transition: background .2s, transform .2s; }
    .btn-claro:hover { background: var(--oro); }
    .btn-claro:active { transform: translateY(1px); }

    @media (max-width: 760px) {
      .seg { padding: 1.35rem; }
      .grid.uno .items { grid-template-columns: 1fr; }
    }
  `],
})
export class MercadoObjetivoComponent {
  cab = CABECERA;
  filtros = FILTROS;
  segmentos = SEGMENTOS;
  estudio = ESTUDIO;

  filtro = signal<IdFiltro>('todos');
  visible = signal(false);
  visibles = computed(() =>
    this.filtro() === 'todos' ? SEGMENTOS : SEGMENTOS.filter((s) => s.id === this.filtro()),
  );

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
        { threshold: 0.15 },
      );
      observer.observe(this.host.nativeElement);
      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}

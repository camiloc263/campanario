import { afterNextRender, Component, DestroyRef, ElementRef, inject, signal } from '@angular/core';
import { TituloSeccionComponent } from '../../../../shared/ui/titulo-seccion/titulo-seccion.component';
import { BENEFICIOS } from '../../data/beneficios.data';
import { Beneficio } from '../../../../shared/models/beneficio.model';

@Component({
  selector: 'app-beneficios',
  standalone: true,
  imports: [TituloSeccionComponent],
  template: `
    <section class="section">
      <div class="wrap">
        <app-titulo-seccion>El problema</app-titulo-seccion>

        <div class="grid" [class.visible]="visible()">
          @for (b of beneficios; track b.titulo) {
            <article class="card" [style.--i]="$index">
              <header class="cab">
                <span class="ico">
                  <svg viewBox="0 0 48 48" width="28" height="28" fill="none" stroke="var(--wood)"
                       stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    @switch (b.icono) {
                      @case ('durabilidad') {
                        <rect x="8" y="9" width="32" height="30" rx="4"/><path d="M8 18h32M17 5v8M31 5v8M18 29l4 4 8-9"/>
                      }
                      @case ('ejemplo') {
                        <circle cx="18" cy="17" r="6"/><path d="M6 38c0-7 5-11 12-11s12 4 12 11"/>
                        <circle cx="33" cy="19" r="5"/><path d="M34 28c6 0 9 4 9 10"/>
                      }
                      @case ('frescura') {
                        <path d="M24 5c8 8 12 14 12 21a12 12 0 0 1-24 0c0-7 4-13 12-21z"/><path d="M18 28a6 6 0 0 0 6 6"/>
                      }
                    }
                  </svg>
                </span>
                <h3>{{ b.titulo }}</h3>
              </header>

              @if (b.items?.length) {
                <ul>
                  @for (i of b.items; track i) {
                    <li [style.--j]="$index">{{ i }}</li>
                  }
                </ul>
              } @else {
                <p class="texto" [id]="'txt-' + $index"
                   [class.colapsado]="largo(b) && !abierta(b.titulo)">{{ b.texto }}</p>

                @if (largo(b)) {
                  <button type="button" class="mas"
                          [attr.aria-expanded]="abierta(b.titulo)"
                          [attr.aria-controls]="'txt-' + $index"
                          (click)="alternar(b.titulo)">
                    {{ abierta(b.titulo) ? 'Leer menos' : 'Leer más' }}
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor"
                         stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"
                         [class.girado]="abierta(b.titulo)">
                      <path d="M6 9l6 6 6-6"/>
                    </svg>
                  </button>
                }
              }
            </article>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
      gap: 1.5rem;
      align-items: start;
      max-width: 960px;
      margin-inline: auto;
    }

    /* ---------- Tarjeta ---------- */
    .card {
      display: grid;
      align-content: start;
      gap: 1.1rem;
      padding: 1.75rem;
      background: var(--surface);
      border: 1px solid var(--line);
      border-top: 3px solid var(--brand);
      border-radius: var(--radius);
      box-shadow: 0 1px 2px rgba(0,0,0,.05), 0 6px 18px rgba(0,0,0,.05);
      transition: transform .25s ease, box-shadow .25s ease;
    }
    .card:hover {
      transform: translateY(-4px);
      box-shadow: 0 2px 4px rgba(0,0,0,.06), 0 14px 30px rgba(0,0,0,.1);
    }

    .cab { display: flex; align-items: center; gap: .9rem; }

    .ico {
      flex: none;
      width: 52px; height: 52px;
      display: grid; place-items: center;
      border-radius: 50%;
      background: color-mix(in srgb, var(--wood) 12%, transparent);
      transition: background .25s ease, transform .25s ease;
    }
    .ico svg { transition: stroke .25s ease; }
    .card:hover .ico { background: var(--brand); transform: rotate(-6deg) scale(1.08); }
    .card:hover .ico svg { stroke: #fff; }

    h3 { font-size: 1rem; font-weight: 800; text-transform: uppercase; letter-spacing: .03em; }

    /* ---------- Texto expandible ---------- */
    .texto {
      margin: 0;
      font-size: .95rem;
      line-height: 1.75;
      color: var(--muted);
      overflow: hidden;
      max-height: 18rem;
      transition: max-height .4s ease;
    }
    .texto.colapsado {
      max-height: 6.8rem;
      -webkit-mask-image: linear-gradient(#000 55%, transparent);
      mask-image: linear-gradient(#000 55%, transparent);
    }

    .mas {
      justify-self: start;
      display: inline-flex;
      align-items: center;
      gap: .35rem;
      padding: .25rem 0;
      background: none;
      border: 0;
      font: inherit;
      font-size: .85rem;
      font-weight: 700;
      color: var(--brand);
      cursor: pointer;
    }
    .mas:hover { color: var(--brand-dark); text-decoration: underline; }
    .mas svg { transition: transform .3s ease; }
    .mas svg.girado { transform: rotate(180deg); }

    /* ---------- Lista de beneficiarios ---------- */
    ul { list-style: none; margin: 0; padding: 0; display: grid; gap: .25rem; }

    li {
      display: flex;
      align-items: flex-start;
      gap: .7rem;
      padding: .5rem .6rem;
      margin-inline: -.6rem;
      border-radius: 6px;
      font-size: .95rem;
      color: var(--ink);
      transition: background .2s ease, transform .2s ease;
    }
    li:hover {
      background: color-mix(in srgb, var(--brand) 8%, transparent);
      transform: translateX(4px);
    }
    li::before {
      content: '';
      flex: none;
      width: 20px; height: 20px;
      margin-top: .1rem;
      border-radius: 50%;
      background: var(--brand) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 12l5 5 9-10'/%3E%3C/svg%3E") center / 12px no-repeat;
    }

    /* ---------- Entrada al hacer scroll ---------- */
    .grid:not(.visible) .card,
    .grid:not(.visible) li { opacity: 0; }

    .grid.visible .card {
      animation: aparecer .6s ease backwards;
      animation-delay: calc(var(--i, 0) * 140ms);
    }
    .grid.visible li {
      animation: aparecer .5s ease backwards;
      animation-delay: calc(var(--i, 0) * 140ms + 300ms + var(--j, 0) * 120ms);
    }
    /* el li hereda --i de su tarjeta */
    @keyframes aparecer {
      from { opacity: 0; transform: translateY(18px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 760px) { .card { padding: 1.35rem; } }
  `],
})
export class BeneficiosComponent {
  beneficios = BENEFICIOS;

  visible = signal(false);
  private abiertas = signal<string[]>([]);

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

  largo(b: Beneficio): boolean {
    return b.texto.length > 180;
  }

  abierta(titulo: string): boolean {
    return this.abiertas().includes(titulo);
  }

  alternar(titulo: string): void {
    this.abiertas.update((a) => (a.includes(titulo) ? a.filter((x) => x !== titulo) : [...a, titulo]));
  }
}
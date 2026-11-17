import { afterNextRender, Component, DestroyRef, ElementRef, inject, signal } from '@angular/core';
import {
  CABECERA, CANALES, FAMILIAS_VINCULADAS, FOTOS, PASOS, TITULOS,
} from '../../data/comercializacion.data';

type ClaveFoto = keyof typeof FOTOS;

@Component({
  selector: 'app-ficha-comercializacion',
  standalone: true,
  template: `
    <section class="section band" id="validacion">
      <div class="wrap">
        <header class="cab">
          <h2>{{ cab.titulo }}</h2>
          @if (cab.nota) { <span class="pill">{{ cab.nota }}</span> }
        </header>

        <div class="cols" [class.visible]="visible()">

          <!-- ===== Estado de validación (línea de tiempo) ===== -->
          <article class="panel">
            <h3 class="ptitulo">
              <span class="ico-t">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor"
                     stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.3a2 2 0 0 0 2-1.7l1.4-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
                </svg>
              </span>
              {{ titulos.validacion }}
            </h3>

            <ol class="linea">
              @for (p of pasos; track p.rotulo; let i = $index) {
                <li [style.--i]="i">
                  <span class="punto" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor"
                         stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M5 12l5 5 9-10"/>
                    </svg>
                  </span>
                  <div class="cuerpo">
                    <strong class="rotulo">{{ p.rotulo }}</strong>
                    <p>
                      @for (parte of partes(p.texto, p.resaltar); track $index) {
                        @if (parte.negrilla) { <b>{{ parte.texto }}</b> } @else { {{ parte.texto }} }
                      }
                    </p>
                  </div>
                </li>
              }
            </ol>

            <div class="dato">
              <span class="cifra">+{{ familias() }}</span>
              <span class="dato-txt">familias vinculadas</span>
            </div>

            <figure class="foto f-paisaje">
              @if (!fallo('paisaje')) {
                <img [src]="fotos.paisaje.src" [alt]="fotos.paisaje.alt" loading="lazy"
                     (error)="falloFoto('paisaje')">
              }
            </figure>
          </article>

          <!-- ===== Canales de comercialización ===== -->
          <article class="panel">
            <h3 class="ptitulo">
              <span class="ico-t">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor"
                     stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/>
                  <path d="M2 3h3l2.6 12.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 7H6"/>
                </svg>
              </span>
              {{ titulos.canales }}
            </h3>

            <div class="canales">
              @for (c of canales; track c.rotulo; let i = $index) {
                <div class="canal" [style.--i]="i">
                  <span class="ico">
                    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor"
                         stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      @switch (c.icono) {
                        @case ('camion') {
                          <rect x="2" y="6" width="13" height="10" rx="2"/><path d="M15 9h4l3 3v4h-7z"/>
                          <circle cx="7" cy="18" r="2"/><circle cx="18" cy="18" r="2"/>
                        }
                        @case ('paquete') {
                          <path d="M21 8l-9-5-9 5v8l9 5 9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/>
                        }
                        @case ('tienda') {
                          <path d="M4 9l1-5h14l1 5"/>
                          <path d="M4 9a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0 2.7 2.7 0 0 0 5.3 0"/>
                          <path d="M5 12v8h14v-8M10 20v-5h4v5"/>
                        }
                        @case ('etiqueta') {
                          <path d="M20.6 13.4l-7.2 7.2a2 2 0 0 1-2.8 0L2 12V2h10l8.6 8.6a2 2 0 0 1 0 2.8z"/>
                          <path d="M7 7h.01"/>
                        }
                      }
                    </svg>
                  </span>
                  <strong class="rotulo">{{ c.rotulo }}</strong>
                  <p>{{ c.texto }}</p>
                </div>
              }
            </div>

            <figure class="foto f-empaques">
              @if (!fallo('empaques')) {
                <img [src]="fotos.empaques.src" [alt]="fotos.empaques.alt" loading="lazy"
                     (error)="falloFoto('empaques')">
              }
            </figure>
          </article>

        </div>
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; }
    .band { background: var(--band); }

    /* ---------- Encabezado ---------- */
    .cab { display: grid; justify-items: center; gap: .7rem; margin-bottom: 2.25rem; text-align: center; }
    .cab h2 { font-size: clamp(1.4rem, 2.6vw, 1.9rem); font-weight: 800; text-transform: uppercase; }
    .pill { padding: .3rem .9rem; border-radius: 999px; background: var(--surface); border: 1px solid var(--line);
            font-size: .72rem; font-weight: 700; letter-spacing: .05em; text-transform: uppercase; color: var(--muted); }

    /* ---------- Paneles ---------- */
    .cols { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1.5rem; align-items: stretch; }
    .panel { display: flex; flex-direction: column; gap: 1.25rem; padding: 1.75rem;
             background: var(--surface); border: 1px solid var(--line); border-top: 3px solid var(--brand);
             border-radius: var(--radius); box-shadow: 0 1px 2px rgba(0,0,0,.05), 0 6px 18px rgba(0,0,0,.05); }

    .ptitulo { display: flex; align-items: center; gap: .75rem; padding-bottom: .9rem;
               border-bottom: 1px solid var(--line); font-size: 1.05rem; font-weight: 800; text-transform: uppercase;
               letter-spacing: .02em; }
    .ico-t { flex: none; width: 40px; height: 40px; display: grid; place-items: center; border-radius: 50%;
             background: color-mix(in srgb, var(--wood) 12%, transparent); color: var(--wood); }

    .rotulo { display: block; font-size: .78rem; font-weight: 800; text-transform: uppercase; letter-spacing: .04em;
              color: var(--ink); }
    p { margin: 0; font-size: .9rem; line-height: 1.6; color: var(--muted); }
    p b { color: var(--ink); font-weight: 700; }

    /* ---------- Línea de tiempo ---------- */
    .linea { list-style: none; margin: 0; padding: 0; display: grid; gap: 1.1rem; }
    .linea li { position: relative; display: grid; grid-template-columns: 32px 1fr; gap: .9rem; }
    .linea li:not(:last-child)::after {
      content: ''; position: absolute; left: 15px; top: 34px; bottom: -1.1rem; width: 2px;
      background: color-mix(in srgb, var(--brand) 25%, var(--line));
    }
    .punto { width: 32px; height: 32px; display: grid; place-items: center; border-radius: 50%;
             background: var(--brand); color: #fff; }
    .cuerpo { padding-top: .2rem; }
    .cuerpo p { margin-top: .15rem; }

    /* ---------- Dato animado ---------- */
    .dato { display: flex; align-items: baseline; gap: .6rem; padding: .85rem 1.1rem; border-radius: 8px;
            background: color-mix(in srgb, var(--brand) 8%, transparent); }
    .cifra { font-size: 1.9rem; font-weight: 800; line-height: 1; color: var(--brand); font-variant-numeric: tabular-nums; }
    .dato-txt { font-size: .85rem; font-weight: 600; color: var(--muted); }

    /* ---------- Canales ---------- */
    .canales { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .9rem; }
    .canal { display: flex; flex-direction: column; gap: .4rem; padding: 1rem; border: 1px solid var(--line);
             border-radius: var(--radius); background: var(--bg);
             transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease; }
    .canal:hover { transform: translateY(-4px); border-color: var(--brand);
                   box-shadow: 0 10px 24px rgba(0,0,0,.09); }
    .ico { width: 48px; height: 48px; display: grid; place-items: center; border-radius: 50%; margin-bottom: .2rem;
           background: color-mix(in srgb, var(--wood) 12%, transparent); color: var(--wood);
           transition: background .25s, color .25s, transform .25s; }
    .canal:hover .ico { background: var(--brand); color: #fff; transform: rotate(-6deg) scale(1.06); }

    /* ---------- Fotos ---------- */
    .foto { position: relative; margin: auto 0 0; aspect-ratio: 16 / 8; overflow: hidden; border-radius: var(--radius);
            border: 1px solid var(--line); }
    .f-paisaje  { background: linear-gradient(135deg, #7aa46a, #2f5d3a); }
    .f-empaques { background: linear-gradient(135deg, #2c2c2b, #5a5a57); }
    .foto img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform .6s ease; }
    .panel:hover .foto img { transform: scale(1.05); }

    /* ---------- Entrada al hacer scroll ---------- */
    .cols:not(.visible) .panel,
    .cols:not(.visible) .punto,
    .cols:not(.visible) .canal,
    .cols:not(.visible) .dato { opacity: 0; }

    .cols.visible .panel  { animation: subir .6s ease backwards; }
    .cols.visible .panel:nth-child(2) { animation-delay: .12s; }
    .cols.visible .punto  { animation: pop .45s cubic-bezier(.3, 1.6, .5, 1) backwards;
                            animation-delay: calc(.35s + var(--i, 0) * .18s); }
    .cols.visible .dato   { animation: subir .5s ease backwards; animation-delay: 1.1s; }
    .cols.visible .canal  { animation: subir .5s ease backwards; animation-delay: calc(.3s + var(--i, 0) * .12s); }

    @keyframes subir { from { opacity: 0; transform: translateY(18px); } }
    @keyframes pop   { from { opacity: 0; transform: scale(.3); } }

    /* ---------- Responsive ---------- */
    @media (max-width: 900px) { .cols { grid-template-columns: 1fr; } }
    @media (max-width: 520px) {
      .panel { padding: 1.25rem; }
      .canales { grid-template-columns: 1fr; }
    }
  `],
})
export class FichaComercializacionComponent {
  cab = CABECERA;
  titulos = TITULOS;
  fotos = FOTOS;
  pasos = PASOS;
  canales = CANALES;

  visible = signal(false);
  familias = signal(0);
  private fallos = signal<ClaveFoto[]>([]);

  private host = inject(ElementRef<HTMLElement>);
  private destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      if (!('IntersectionObserver' in window)) {
        this.mostrar();
        return;
      }
      const observer = new IntersectionObserver(
        ([entrada]) => {
          if (entrada.isIntersecting) {
            this.mostrar();
            observer.disconnect();
          }
        },
        { threshold: 0.2 },
      );
      observer.observe(this.host.nativeElement);
      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }

  private mostrar(): void {
    this.visible.set(true);
    this.contar(FAMILIAS_VINCULADAS);
  }

  /** Anima el número de 0 al valor final (sin animación si el usuario prefiere menos movimiento). */
  private contar(objetivo: number): void {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.familias.set(objetivo);
      return;
    }
    const duracion = 1400;
    const inicio = performance.now();
    const paso = (t: number) => {
      const p = Math.min(1, (t - inicio) / duracion);
      this.familias.set(Math.round(objetivo * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(paso);
    };
    requestAnimationFrame(paso);
  }

  /** Divide un texto en partes para poner en negrilla el fragmento `resaltar`. */
  partes(texto: string, resaltar?: string): { texto: string; negrilla: boolean }[] {
    if (!resaltar || !texto.includes(resaltar)) return [{ texto, negrilla: false }];
    const [antes, ...resto] = texto.split(resaltar);
    return [
      { texto: antes, negrilla: false },
      { texto: resaltar, negrilla: true },
      { texto: resto.join(resaltar), negrilla: false },
    ];
  }

  fallo(clave: ClaveFoto): boolean {
    return this.fallos().includes(clave);
  }

  falloFoto(clave: ClaveFoto): void {
    this.fallos.update((f) => [...f, clave]);
  }
}

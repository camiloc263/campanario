import { afterNextRender, Component, DestroyRef, ElementRef, computed, inject, signal } from '@angular/core';
import { BotonComponent } from '../../../../shared/ui/boton/boton.component';
import { urlWhatsapp } from '../../../../core/config/contacto';
import { DIAPOSITIVAS, HERO } from '../../data/hero.data';
@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [BotonComponent],
  template: `
    <section class="hero">
      <div class="wrap grid">

        <!-- ===== Galería ===== -->
        <div class="visual">
          <div class="foto" #foto (pointermove)="inclinar($event, foto)" (pointerleave)="sinInclinar()"
               (pointerenter)="pausar()" (focusin)="pausar()" (focusout)="reanudar()"
               [style.transform]="'perspective(1000px) rotateX(' + rx() + 'deg) rotateY(' + ry() + 'deg)'"
               role="region" aria-roledescription="carrusel" aria-label="Galería de la granja"
               tabindex="0" (keydown)="teclas($event)">

            <div class="slides" [attr.aria-live]="reproduciendo() ? 'off' : 'polite'">
              @for (d of activas(); track d.id; let i = $index) {
                <div class="slide" [class.on]="i === idx()" role="group" aria-roledescription="diapositiva"
                     [attr.aria-label]="(i + 1) + ' de ' + activas().length" [attr.aria-hidden]="i !== idx()">
                  @if (!fallo(d.id)) {
                    <img [src]="d.src" [alt]="d.alt" width="800" height="640"
                         [attr.fetchpriority]="i === 0 ? 'high' : null" (error)="falloImagen(d.id)">
                  } @else {
                    <span class="ph" aria-hidden="true">
                      <svg viewBox="0 0 24 24" width="84" height="84" fill="none" stroke="currentColor"
                           stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M3 21V9l9-6 9 6v12"/><path d="M9 21v-6h6v6"/>
                      </svg>
                    </span>
                  }
                </div>
              }
            </div>

            <div class="vel"></div>

            @if (activas().length > 1) {
              <button type="button" class="flecha ant" aria-label="Imagen anterior" (click)="mover(-1)">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5"
                     stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>
              </button>
              <button type="button" class="flecha sig" aria-label="Imagen siguiente" (click)="mover(1)">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5"
                     stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>
              </button>
            }

            <div class="pie">
              <span class="leyenda">{{ actual().leyenda }}</span>
              @if (activas().length > 1) {
                <div class="ctrl">
                  @for (d of activas(); track d.id; let i = $index) {
                    <button type="button" class="punto" [class.on]="i === idx()"
                            [attr.aria-label]="'Ver imagen ' + (i + 1)" [attr.aria-current]="i === idx()"
                            (click)="ir(i)"></button>
                  }
                  <button type="button" class="pausa" [attr.aria-pressed]="!reproduciendo()"
                          [attr.aria-label]="reproduciendo() ? 'Pausar presentación' : 'Reanudar presentación'"
                          (click)="reproduciendo.set(!reproduciendo())">
                    @if (reproduciendo()) {
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
                        <rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/>
                      </svg>
                    } @else {
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
                        <path d="M7 4l13 8-13 8z"/>
                      </svg>
                    }
                  </button>
                </div>
              }
            </div>
          </div>

          <!-- Tarjetas flotantes -->
          <div class="flota f1">
            <span class="f-ico">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.9"
                   stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>
              </svg>
            </span>
            <span><strong>{{ d.sello.titulo }}</strong><small>{{ d.sello.texto }}</small></span>
          </div>
          <div class="flota f2">
            <strong class="cifra">+{{ familias() }}</strong>
            <small>familias<br>vinculadas</small>
          </div>
        </div>

        <!-- ===== Texto ===== -->
        <div class="texto">
          <div class="pills" style="--d: 0">
            <span class="pill">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"
                   stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M3 21V9l9-6 9 6v12"/><path d="M9 21v-6h6v6"/>
              </svg>
              {{ d.unidad }}
            </span>
            <span class="pill">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"
                   stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>
              </svg>
              {{ d.ubicacion }}
            </span>
          </div>

          <h1 style="--d: 1">
            <span class="pre">{{ d.pre }}</span>
            <span class="marca">{{ d.marca }}</span>
          </h1>

          <p class="lead" style="--d: 2">{{ d.texto }}</p>

          <ul class="rasgos" style="--d: 3">
            @for (r of d.rasgos; track r) {
              <li>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3"
                     stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg>
                {{ r }}
              </li>
            }
          </ul>

          <div class="botones" style="--d: 4">
            <app-boton ruta="/productos">{{ d.botonPrincipal }}</app-boton>
            <a class="sec" [href]="whatsapp" target="_blank" rel="noopener">{{ d.botonSecundario }}</a>
          </div>
        </div>
      </div>

      <button type="button" class="bajar" (click)="bajar()">
        Descubre más
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4"
             stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
      </button>
    </section>
  `,
  styles: [`
    :host { display: block; }

    .hero { position: relative; overflow: hidden; background: var(--band); padding: clamp(2.5rem, 6vw, 4.5rem) 0 4.5rem; }
    .hero::before, .hero::after { content: ''; position: absolute; border-radius: 50%; pointer-events: none; }
    .hero::before { width: 520px; height: 520px; left: -180px; top: -200px;
                    background: radial-gradient(circle, color-mix(in srgb, var(--brand) 16%, transparent), transparent 70%); }
    .hero::after { width: 460px; height: 460px; right: -160px; bottom: -200px;
                   background: radial-gradient(circle, color-mix(in srgb, var(--wood) 18%, transparent), transparent 70%); }

    .grid { position: relative; z-index: 1; display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
            gap: clamp(2rem, 5vw, 4rem); align-items: center; }

    /* ---------- Galería ---------- */
    .visual { position: relative; }
    .foto { position: relative; aspect-ratio: 5 / 4; overflow: hidden; border-radius: 18px; background: var(--brand-dark);
            box-shadow: 0 24px 50px rgba(0,0,0,.22); transition: transform .25s ease-out; will-change: transform; }
    .foto:focus-visible { outline: 3px solid var(--brand); outline-offset: 4px; }
    .slides { position: absolute; inset: 0; }
    .slide { position: absolute; inset: 0; opacity: 0; transform: scale(1.06);
             transition: opacity .8s ease, transform 1.6s ease; }
    .slide.on { opacity: 1; transform: scale(1); }
    .slide img { width: 100%; height: 100%; object-fit: cover; }
    .ph { width: 100%; height: 100%; display: grid; place-items: center; color: rgba(255,255,255,.5);
          background: linear-gradient(135deg, #b98a57, var(--wood)); }
    .vel { position: absolute; inset: auto 0 0 0; height: 45%; pointer-events: none;
           background: linear-gradient(to top, rgba(10,22,26,.75), transparent); }

    .flecha { position: absolute; top: 50%; z-index: 2; width: 40px; height: 40px; margin-top: -20px; border: 0; border-radius: 50%;
              display: grid; place-items: center; background: rgba(255,255,255,.9); color: var(--brand-dark); cursor: pointer;
              opacity: 0; transition: opacity .25s, transform .2s, background .2s; }
    .flecha.ant { left: .9rem; } .flecha.sig { right: .9rem; }
    .foto:hover .flecha, .foto:focus-within .flecha { opacity: 1; }
    .flecha:hover { background: #fff; transform: scale(1.08); }

    .pie { position: absolute; left: 1.1rem; right: 1.1rem; bottom: 1rem; z-index: 2; display: flex;
           align-items: center; justify-content: space-between; gap: 1rem; color: #fff; }
    .leyenda { font-size: .85rem; font-weight: 600; text-shadow: 0 1px 6px rgba(0,0,0,.5); }
    .ctrl { display: flex; align-items: center; gap: .4rem; }
    .punto { width: 8px; height: 8px; padding: 0; border: 0; border-radius: 999px; background: rgba(255,255,255,.5);
             cursor: pointer; transition: width .3s, background .3s; }
    .punto.on { width: 24px; background: #fff; }
    .pausa { width: 26px; height: 26px; margin-left: .3rem; border: 0; border-radius: 50%; display: grid; place-items: center;
             background: rgba(255,255,255,.22); color: #fff; cursor: pointer; transition: background .2s; }
    .pausa:hover { background: rgba(255,255,255,.4); }

    .flota { position: absolute; z-index: 3; display: flex; align-items: center; gap: .65rem; padding: .65rem .95rem;
             background: rgba(255,255,255,.94); backdrop-filter: blur(6px); border-radius: 14px;
             box-shadow: 0 10px 28px rgba(0,0,0,.18); animation: flotar 5s ease-in-out infinite; }
    .flota strong { display: block; font-size: .85rem; line-height: 1.2; color: var(--ink); }
    .flota small { display: block; font-size: .72rem; line-height: 1.3; color: var(--muted); }
    .f1 { top: 1.5rem; right: -1.25rem; }
    .f2 { left: -1.25rem; bottom: 3.75rem; animation-delay: -2.5s; }
    .f-ico { flex: none; width: 36px; height: 36px; display: grid; place-items: center; border-radius: 10px;
             color: #fff; background: var(--brand); }
    .cifra { font-size: 1.7rem !important; font-weight: 800; color: var(--brand) !important; font-variant-numeric: tabular-nums; }
    @keyframes flotar { 50% { transform: translateY(-7px); } }

    /* ---------- Texto ---------- */
    .texto > * { animation: subir .7s ease backwards; animation-delay: calc(var(--d, 0) * .1s + .1s); }
    @keyframes subir { from { opacity: 0; transform: translateY(18px); } }

    .pills { display: flex; flex-wrap: wrap; gap: .5rem; }
    .pill { display: inline-flex; align-items: center; gap: .4rem; padding: .35rem .85rem; border-radius: 999px;
            background: var(--surface); border: 1px solid var(--line); font-size: .76rem; font-weight: 700;
            letter-spacing: .03em; text-transform: uppercase; color: var(--brand); }

    h1 { margin: 1.1rem 0 0; font-weight: 800; line-height: 1.02; letter-spacing: -.02em; text-transform: uppercase;
         font-size: clamp(2.1rem, 4.6vw, 3.5rem); }
    h1 .pre { display: block; margin-bottom: .5em; font-size: .36em; letter-spacing: .18em; color: var(--wood); }
    h1 .marca { display: block; }
    h1 .marca::after { content: ''; display: block; width: 72px; height: 5px; margin-top: .45em; border-radius: 999px;
                       background: linear-gradient(90deg, var(--brand), var(--wood)); }

    .lead { margin: 1.25rem 0 0; max-width: 52ch; font-size: 1.04rem; line-height: 1.75; color: var(--muted); }

    .rasgos { list-style: none; margin: 1.25rem 0 0; padding: 0; display: flex; flex-wrap: wrap; gap: .5rem; }
    .rasgos li { display: inline-flex; align-items: center; gap: .4rem; padding: .35rem .8rem .35rem .55rem; border-radius: 999px;
                 background: color-mix(in srgb, var(--brand) 9%, transparent); font-size: .8rem; font-weight: 600; color: var(--ink);
                 transition: background .2s, transform .2s; }
    .rasgos li svg { padding: 2px; border-radius: 50%; background: var(--brand); color: #fff; box-sizing: content-box; }
    .rasgos li:hover { background: color-mix(in srgb, var(--brand) 16%, transparent); transform: translateY(-2px); }

    .botones { display: flex; flex-wrap: wrap; align-items: center; gap: .8rem; margin-top: 1.9rem; }
    .sec { display: inline-block; padding: .85rem 1.6rem; border: 1.5px solid var(--brand); border-radius: 4px; background: transparent;
           font-size: .85rem; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; text-decoration: none;
           color: var(--brand); transition: background .2s, color .2s; }
    .sec:hover { background: var(--brand); color: #fff; }

    .bajar { position: absolute; z-index: 1; left: 50%; bottom: 1rem; transform: translateX(-50%); display: inline-flex;
             align-items: center; gap: .35rem; padding: .4rem .8rem; border: 0; background: none; font: inherit;
             font-size: .78rem; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); cursor: pointer; }
    .bajar svg { animation: rebotar 1.6s ease-in-out infinite; }
    .bajar:hover { color: var(--brand); }
    @keyframes rebotar { 50% { transform: translateY(4px); } }

    /* ---------- Responsive ---------- */
    @media (max-width: 860px) {
      .grid { grid-template-columns: 1fr; }
      .texto { order: -1; text-align: center; }
      .pills, .rasgos, .botones { justify-content: center; }
      .lead { margin-inline: auto; }
      h1 .marca::after { margin-inline: auto; }
      .f1 { right: .75rem; top: .75rem; }
      .f2 { left: .75rem; bottom: 3.5rem; }
      .flecha { opacity: 1; }
      .bajar { display: none; }
      .hero { padding-bottom: 2.5rem; }
    }
  `],
})
export class HeroComponent {
  d = HERO;
  whatsapp = urlWhatsapp(HERO.mensajeWhatsapp);

  indice = signal(0);
  reproduciendo = signal(true);
  familias = signal(0);
  rx = signal(0);
  ry = signal(0);

  private fallos = signal<string[]>([]);
  private pausaTemporal = false;
  private ultimoCambio = Date.now();
  private reducido = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /** Diapositivas cuya imagen sí existe (si ninguna carga, se deja la primera con su ícono). */
  activas = computed(() => {
    const ok = DIAPOSITIVAS.filter((x) => !this.fallos().includes(x.id));
    return ok.length ? ok : [DIAPOSITIVAS[0]];
  });
  idx = computed(() => Math.min(this.indice(), this.activas().length - 1));
  actual = computed(() => this.activas()[this.idx()]);

  private host = inject(ElementRef<HTMLElement>);
  private destroyRef = inject(DestroyRef);

  constructor() {
    if (this.reducido) this.reproduciendo.set(false);

    afterNextRender(() => {
      // Presentación automática (se pausa con el mouse, el foco o el botón)
      const id = setInterval(() => {
        if (
          this.reproduciendo() && !this.pausaTemporal && !document.hidden &&
          this.activas().length > 1 && Date.now() - this.ultimoCambio >= 5800
        ) {
          this.mover(1);
        }
      }, 1000);
      this.destroyRef.onDestroy(() => clearInterval(id));

      // Contador de familias
      const objetivo = HERO.familias;
      if (this.reducido) {
        this.familias.set(objetivo);
        return;
      }
      const espera = setTimeout(() => {
        const inicio = performance.now();
        const paso = (t: number) => {
          const p = Math.min(1, (t - inicio) / 1400);
          this.familias.set(Math.round(objetivo * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(paso);
        };
        requestAnimationFrame(paso);
      }, 600);
      this.destroyRef.onDestroy(() => clearTimeout(espera));
    });
  }

  // ---------- Galería ----------
  mover(dir: 1 | -1): void {
    const n = this.activas().length;
    this.ir((this.idx() + dir + n) % n);
  }

  ir(i: number): void {
    this.indice.set(i);
    this.ultimoCambio = Date.now();
  }

  teclas(ev: KeyboardEvent): void {
    if (ev.key === 'ArrowRight') { ev.preventDefault(); this.mover(1); }
    else if (ev.key === 'ArrowLeft') { ev.preventDefault(); this.mover(-1); }
  }

  pausar(): void { this.pausaTemporal = true; }
  reanudar(): void { this.pausaTemporal = false; }

  fallo(id: string): boolean {
    return this.fallos().includes(id);
  }

  falloImagen(id: string): void {
    this.fallos.update((f) => [...f, id]);
  }

  // ---------- Inclinación 3D suave con el mouse ----------
  inclinar(ev: PointerEvent, el: HTMLElement): void {
    if (ev.pointerType !== 'mouse' || this.reducido) return;
    const r = el.getBoundingClientRect();
    this.ry.set(((ev.clientX - r.left) / r.width - 0.5) * 6);
    this.rx.set(-((ev.clientY - r.top) / r.height - 0.5) * 6);
  }

  sinInclinar(): void {
    this.rx.set(0);
    this.ry.set(0);
    this.reanudar();
  }

  // ---------- Desplazamiento ----------
  bajar(): void {
    const siguiente = this.host.nativeElement.nextElementSibling as HTMLElement | null;
    siguiente?.scrollIntoView({ behavior: this.reducido ? 'auto' : 'smooth', block: 'start' });
  }
}

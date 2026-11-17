import {
  ChangeDetectionStrategy, Component, ElementRef, computed, inject, signal,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { CABECERA, ETAPAS, PILARES, SELLOS } from '../data/cadena-valor.data';

@Component({
  selector: 'app-cadena-valor',
  standalone: true,
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Íconos -->
    <ng-template #iconoTpl let-nombre let-tam="tam">
      <svg viewBox="0 0 24 24" [attr.width]="tam" [attr.height]="tam" fill="none" stroke="currentColor"
           stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        @switch (nombre) {
          @case ('granja') { <path d="M3 21V9l9-6 9 6v12"/><path d="M9 21v-6h6v6"/> }
          @case ('escudo') { <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/> }
          @case ('camion') {
            <rect x="2" y="6" width="13" height="10" rx="2"/><path d="M15 9h4l3 3v4h-7z"/>
            <circle cx="7" cy="18" r="2"/><circle cx="18" cy="18" r="2"/>
          }
          @case ('paquete') { <path d="M21 8l-9-5-9 5v8l9 5 9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/> }
          @case ('tienda') {
            <path d="M4 9l1-5h14l1 5"/>
            <path d="M4 9a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0 2.7 2.7 0 0 0 5.3 0"/>
            <path d="M5 12v8h14v-8M10 20v-5h4v5"/>
          }
        }
      </svg>
    </ng-template>

    <!-- Foto con respaldo de ícono si la imagen no existe -->
    <ng-template #foto let-ruta let-alt="alt" let-clave="clave" let-icono="icono" let-tam="tam">
      @if (ruta && !fallo(clave)) {
        <img [src]="ruta" [alt]="alt" loading="lazy" (error)="falloImagen(clave)">
      } @else {
        <span class="ph">
          <ng-container [ngTemplateOutlet]="iconoTpl" [ngTemplateOutletContext]="{ $implicit: icono, tam: tam }" />
        </span>
      }
    </ng-template>

    <section class="section">
      <div class="wrap">

        <header class="cab">
          <span class="kicker">{{ cab.kicker }}</span>
          <h2>{{ cab.titulo }}</h2>
          <p class="lema">{{ cab.lema }}</p>
        </header>

        <!-- ===== Panorámica con pilares ===== -->
        <div class="bloque">
          <div class="pano">
            @for (p of pilares; track p.id) {
              <div class="pano-img" [class.on]="pilarId() === p.id" aria-hidden="true">
                <ng-container [ngTemplateOutlet]="foto"
                  [ngTemplateOutletContext]="{ $implicit: p.imagen, alt: p.alt, clave: 'p-' + p.id, icono: p.icono, tam: 72 }" />
              </div>
            }
            <div class="pano-vel"></div>

            @for (p of [pilarActivo()]; track p.id) {
              <div class="pano-txt" id="panel-pilar" role="tabpanel" [attr.aria-labelledby]="'tab-' + p.id">
                <span class="ind">{{ p.indicador }}</span>
                <p>{{ p.detalle }}</p>
              </div>
            }
          </div>

          <div class="tabs" role="tablist" aria-label="Pilares operativos">
            @for (p of pilares; track p.id; let i = $index) {
              <button type="button" role="tab" class="tab" [id]="'tab-' + p.id"
                      [class.on]="pilarId() === p.id" [attr.aria-selected]="pilarId() === p.id"
                      aria-controls="panel-pilar" [attr.tabindex]="pilarId() === p.id ? 0 : -1"
                      (click)="seleccionarPilar(p.id)" (keydown)="teclas($event, i)">
                <span class="tab-ico">
                  <ng-container [ngTemplateOutlet]="iconoTpl" [ngTemplateOutletContext]="{ $implicit: p.icono, tam: 22 }" />
                </span>
                <span class="tab-txt">
                  <strong>{{ p.titulo }}</strong>
                  <span>{{ p.subtitulo }}</span>
                </span>
              </button>
            }
          </div>
        </div>

        <!-- ===== Cadena de valor ===== -->
        <div class="cadena">
          <div class="cab-cadena">
            <div>
              <span class="kicker2">{{ cab.subtituloCadena }}</span>
              <h3>{{ cab.tituloCadena }}</h3>
            </div>
            <p>{{ cab.ayudaCadena }}</p>
          </div>

          <div class="etapas" role="group" aria-label="Etapas de la cadena de valor">
            @for (e of etapas; track e.id) {
              <button type="button" class="etapa" [class.on]="etapaId() === e.id"
                      [attr.aria-pressed]="etapaId() === e.id" (click)="seleccionarEtapa(e.id)">
                <span class="et-foto">
                  <ng-container [ngTemplateOutlet]="foto"
                    [ngTemplateOutletContext]="{ $implicit: e.imagen, alt: e.alt, clave: 'e-' + e.id, icono: e.icono, tam: 40 }" />
                  <span class="et-num">{{ e.numero }}</span>
                </span>
                <span class="et-body">
                  <strong>{{ e.titulo }}</strong>
                  <span class="et-desc">{{ e.descripcion }}</span>
                  <span class="et-cta">{{ etapaId() === e.id ? 'Viendo detalle' : 'Explorar etapa' }} <i>→</i></span>
                </span>
              </button>
            }
          </div>

          @for (e of [etapaActiva()]; track e.id) {
            <div class="detalle" aria-live="polite">
              <div class="d-texto">
                <span class="d-kicker">Etapa {{ e.numero }} de {{ etapas.length }} · Estándar Campanario</span>
                <h3>{{ e.titulo }}</h3>
                <p>{{ e.detalleAmpliado }}</p>
                <div class="d-nav">
                  <button type="button" class="nav" [disabled]="indiceEtapa() === 0" (click)="moverEtapa(-1)">
                    ‹ Etapa anterior
                  </button>
                  <button type="button" class="nav" [disabled]="indiceEtapa() === etapas.length - 1" (click)="moverEtapa(1)">
                    Siguiente etapa ›
                  </button>
                </div>
              </div>

              <div class="d-garantias">
                <span class="g-tit">Garantías clave</span>
                <ul>
                  @for (b of e.beneficios; track b) { <li>{{ b }}</li> }
                </ul>
              </div>
            </div>
          }
        </div>

        <!-- ===== Compromisos ===== -->
        <ul class="sellos">
          @for (s of sellos; track s.texto) {
            <li class="sello">
              <span class="chk" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3"
                     stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10"/></svg>
              </span>
              <div>
                <strong>{{ s.texto }}</strong>
                <span>{{ s.descripcion }}</span>
              </div>
            </li>
          }
        </ul>

      </div>
    </section>
  `,
  styles: [`
    :host { display: block; }

    /* ---------- Encabezado ---------- */
    .cab { display: grid; justify-items: center; gap: .7rem; margin-bottom: 2.25rem; text-align: center; }
    .kicker { padding: .3rem .9rem; border-radius: 999px; background: var(--surface); border: 1px solid var(--line);
              font-size: .72rem; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); }
    .cab h2 { max-width: 22ch; font-size: clamp(1.5rem, 3vw, 2.1rem); font-weight: 800; line-height: 1.2; }
    .lema { margin: 0; padding: .4rem 1.1rem; border-radius: 999px; background: color-mix(in srgb, var(--wood) 10%, transparent);
            color: var(--wood); font-size: .9rem; font-weight: 600; font-style: italic; }

    /* ---------- Foto / ícono de respaldo ---------- */
    img { width: 100%; height: 100%; object-fit: cover; }
    .ph { width: 100%; height: 100%; display: grid; place-items: center; color: var(--wood); background: var(--band); }

    /* ---------- Panorámica ---------- */
    .bloque { overflow: hidden; background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius);
              box-shadow: 0 1px 2px rgba(0,0,0,.05), 0 8px 24px rgba(0,0,0,.06); }
    .pano { position: relative; aspect-ratio: 21 / 8; min-height: 250px; overflow: hidden; background: var(--brand-dark); }
    .pano-img { position: absolute; inset: 0; opacity: 0; transform: scale(1.04);
                transition: opacity .7s ease, transform 1.2s ease; }
    .pano-img.on { opacity: 1; transform: scale(1); }
    .pano .ph { color: rgba(255,255,255,.55); background: linear-gradient(135deg, var(--brand), var(--brand-dark)); }
    .pano-vel { position: absolute; inset: 0; background: linear-gradient(to top, rgba(10,25,30,.82), rgba(10,25,30,.15) 60%, transparent); }
    .pano-txt { position: absolute; left: 1.5rem; right: 1.5rem; bottom: 1.25rem; color: #fff; animation: subir .5s ease; }
    .ind { font-size: .72rem; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; color: #e6c79c; }
    .pano-txt p { margin: .35rem 0 0; max-width: 62ch; font-size: .98rem; line-height: 1.65; color: rgba(255,255,255,.92); }

    .tabs { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); border-top: 1px solid var(--line); }
    .tab { position: relative; display: flex; align-items: center; gap: .9rem; padding: 1.1rem 1.25rem; text-align: left;
           background: var(--surface); border: 0; border-right: 1px solid var(--line); font: inherit; cursor: pointer;
           transition: background .2s; }
    .tab:last-child { border-right: 0; }
    .tab::before { content: ''; position: absolute; inset: 0 0 auto 0; height: 3px; background: transparent; transition: background .3s; }
    .tab:hover { background: var(--bg); }
    .tab.on { background: var(--bg); }
    .tab.on::before { background: var(--brand); }
    .tab-ico { flex: none; width: 44px; height: 44px; display: grid; place-items: center; border-radius: 50%;
               color: var(--wood); background: color-mix(in srgb, var(--wood) 12%, transparent); transition: background .25s, color .25s; }
    .tab.on .tab-ico { background: var(--brand); color: #fff; }
    .tab-txt { display: grid; gap: .1rem; }
    .tab-txt strong { font-size: .98rem; color: var(--ink); }
    .tab-txt span { font-size: .8rem; color: var(--muted); line-height: 1.4; }

    /* ---------- Cadena ---------- */
    .cadena { margin-top: 3rem; }
    .cab-cadena { display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: .5rem 1.5rem; margin-bottom: 1.5rem; }
    .kicker2 { display: block; font-size: .72rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--muted); }
    .cab-cadena h3 { font-size: clamp(1.3rem, 2.4vw, 1.7rem); font-weight: 800; }
    .cab-cadena p { margin: 0; font-size: .85rem; color: var(--muted); }

    .etapas { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr)); gap: 1.25rem; }
    .etapa { position: relative; display: flex; flex-direction: column; overflow: hidden; text-align: left; padding: 0;
             background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius); font: inherit; cursor: pointer;
             box-shadow: 0 1px 2px rgba(0,0,0,.05); transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease; }
    .etapa:hover { transform: translateY(-3px); box-shadow: 0 10px 24px rgba(0,0,0,.1); }
    .etapa.on { border-color: var(--brand); box-shadow: 0 0 0 1px var(--brand), 0 12px 28px rgba(0,0,0,.12); transform: translateY(-4px); }
    .et-foto { position: relative; display: block; aspect-ratio: 4 / 3; overflow: hidden; background: var(--band); }
    .et-foto img { transition: transform .5s ease; }
    .etapa:hover .et-foto img { transform: scale(1.06); }
    .et-num { position: absolute; top: .7rem; left: .7rem; padding: .15rem .6rem; border-radius: 999px;
              background: rgba(255,255,255,.92); font-size: .72rem; font-weight: 800; color: var(--brand); }
    .etapa.on .et-num { background: var(--brand); color: #fff; }
    .et-body { display: flex; flex-direction: column; gap: .35rem; flex: 1; padding: 1rem 1.1rem 1.1rem; }
    .et-body strong { font-size: 1rem; color: var(--ink); }
    .et-desc { font-size: .82rem; line-height: 1.5; color: var(--muted); }
    .et-cta { margin-top: auto; padding-top: .5rem; font-size: .8rem; font-weight: 700; color: var(--brand); }
    .et-cta i { display: inline-block; font-style: normal; transition: transform .2s; }
    .etapa:hover .et-cta i { transform: translateX(4px); }

    /* ---------- Detalle de etapa ---------- */
    .detalle { display: grid; grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); gap: 1.5rem; margin-top: 1.5rem;
               padding: clamp(1.4rem, 3vw, 2rem); background: var(--surface); border: 1px solid var(--line);
               border-top: 3px solid var(--brand); border-radius: var(--radius);
               box-shadow: 0 1px 2px rgba(0,0,0,.05), 0 6px 18px rgba(0,0,0,.05); animation: subir .45s ease; }
    .d-kicker { font-size: .72rem; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; color: var(--wood); }
    .d-texto h3 { margin: .4rem 0 .7rem; font-size: clamp(1.3rem, 2.4vw, 1.7rem); font-weight: 800; }
    .d-texto p { margin: 0; font-size: .98rem; line-height: 1.75; color: var(--muted); }
    .d-nav { display: flex; flex-wrap: wrap; gap: .6rem; margin-top: 1.25rem; }
    .nav { padding: .6rem 1rem; background: none; border: 1px solid var(--line); border-radius: 4px; font: inherit;
           font-size: .85rem; font-weight: 600; color: var(--ink); cursor: pointer; transition: background .2s, border-color .2s; }
    .nav:hover:not(:disabled) { background: var(--band); border-color: var(--brand); }
    .nav:disabled { opacity: .4; cursor: default; }

    .d-garantias { padding: 1.25rem; border-radius: 10px; background: var(--bg); border: 1px solid var(--line); align-self: start; }
    .g-tit { display: block; margin-bottom: .8rem; font-size: .72rem; font-weight: 800; letter-spacing: .06em;
             text-transform: uppercase; color: var(--muted); }
    .d-garantias ul { list-style: none; margin: 0; padding: 0; display: grid; gap: .7rem; }
    .d-garantias li { display: flex; gap: .65rem; align-items: flex-start; font-size: .9rem; line-height: 1.5; color: var(--ink); }
    .d-garantias li::before {
      content: ''; flex: none; width: 18px; height: 18px; margin-top: .12rem; border-radius: 50%;
      background: var(--brand) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 12l5 5 9-10'/%3E%3C/svg%3E") center / 11px no-repeat;
    }

    /* ---------- Compromisos ---------- */
    .sellos { list-style: none; margin: 2.5rem 0 0; padding: 1.75rem 0 0; border-top: 1px solid var(--line);
              display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr)); gap: 1rem; }
    .sello { display: flex; gap: .8rem; align-items: flex-start; padding: 1rem; background: var(--surface);
             border: 1px solid var(--line); border-radius: 12px; transition: border-color .2s, transform .2s; }
    .sello:hover { border-color: var(--brand); transform: translateY(-2px); }
    .chk { flex: none; width: 26px; height: 26px; display: grid; place-items: center; border-radius: 50%; background: var(--brand); color: #fff; }
    .sello strong { display: block; font-size: .92rem; color: var(--ink); }
    .sello span { font-size: .8rem; line-height: 1.45; color: var(--muted); }

    @keyframes subir { from { opacity: 0; transform: translateY(14px); } }

    /* ---------- Responsive ---------- */
    @media (max-width: 900px) {
      .tabs { grid-template-columns: 1fr; }
      .tab { border-right: 0; border-bottom: 1px solid var(--line); }
      .tab:last-child { border-bottom: 0; }
      .detalle { grid-template-columns: 1fr; }
      .pano { aspect-ratio: 4 / 3; }
    }
  `],
})
export class CadenaValorComponent {
  cab = CABECERA;
  pilares = PILARES;
  etapas = ETAPAS;
  sellos = SELLOS;

  pilarId = signal(PILARES[0].id);
  etapaId = signal(ETAPAS[0].id);

  pilarActivo = computed(() => PILARES.find((p) => p.id === this.pilarId()) ?? PILARES[0]);
  etapaActiva = computed(() => ETAPAS.find((e) => e.id === this.etapaId()) ?? ETAPAS[0]);
  indiceEtapa = computed(() => ETAPAS.findIndex((e) => e.id === this.etapaId()));

  private fallos = signal<string[]>([]);
  private host = inject(ElementRef<HTMLElement>);

  seleccionarPilar(id: string): void {
    this.pilarId.set(id);
  }

  seleccionarEtapa(id: string): void {
    this.etapaId.set(id);
  }

  moverEtapa(dir: 1 | -1): void {
    const i = this.indiceEtapa() + dir;
    if (i >= 0 && i < ETAPAS.length) this.etapaId.set(ETAPAS[i].id);
  }

  /** Navegación por teclado entre pestañas (← → Inicio Fin). */
  teclas(ev: KeyboardEvent, i: number): void {
    const n = PILARES.length;
    let j: number;
    switch (ev.key) {
      case 'ArrowRight': j = (i + 1) % n; break;
      case 'ArrowLeft': j = (i - 1 + n) % n; break;
      case 'Home': j = 0; break;
      case 'End': j = n - 1; break;
      default: return;
    }
    ev.preventDefault();
    this.seleccionarPilar(PILARES[j].id);
    setTimeout(() =>
      (this.host.nativeElement.querySelector('[role="tab"][aria-selected="true"]') as HTMLElement | null)?.focus(),
    );
  }

  fallo(clave: string): boolean {
    return this.fallos().includes(clave);
  }

  falloImagen(clave: string): void {
    this.fallos.update((f) => [...f, clave]);
  }
}

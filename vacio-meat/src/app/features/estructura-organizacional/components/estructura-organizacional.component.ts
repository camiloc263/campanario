import {
  afterNextRender, Component, DestroyRef, ElementRef, inject, signal, viewChild,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { CABECERA, EQUIPO, GERENCIA, RolEquipo } from '../data/estructura.data';

@Component({
  selector: 'app-estructura-organizacional',
  standalone: true,
  imports: [NgTemplateOutlet],
  template: `
    <!-- Ícono de cada rol (se reutiliza en tarjetas y en la ventana) -->
    <ng-template #icono let-nombre let-tam="tam">
      <svg viewBox="0 0 24 24" [attr.width]="tam" [attr.height]="tam" fill="none" stroke="currentColor"
           stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        @switch (nombre) {
          @case ('gerencia') {
            <rect x="3" y="7" width="18" height="13" rx="2"/>
            <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18"/>
          }
          @case ('pecuario') { <path d="M3 21V9l9-6 9 6v12"/><path d="M9 21v-6h6v6"/> }
          @case ('empaque') { <path d="M21 8l-9-5-9 5v8l9 5 9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/> }
          @case ('contable') {
            <path d="M4 20h16"/><rect x="6" y="11" width="3" height="9"/>
            <rect x="11" y="6" width="3" height="14"/><rect x="16" y="14" width="3" height="6"/>
          }
        }
      </svg>
    </ng-template>

    <section class="section band">
      <div class="wrap">
        <header class="cab">
          <h2>{{ cab.titulo }}</h2>
          <p>{{ cab.subtitulo }}</p>
          @if (cab.nota) { <span class="pill">{{ cab.nota }}</span> }
        </header>

        <div class="org" [class.visible]="visible()">

          <!-- ===== Nivel 1: gerencia ===== -->
          <div class="padre">
            <article class="rol lider" [style.--acento]="gerencia.acento" (click)="abrir(gerencia)">
              <span class="barra"></span>
              <div class="rol-top">
                <span class="ico">
                  <ng-container [ngTemplateOutlet]="icono"
                                [ngTemplateOutletContext]="{ $implicit: gerencia.icono, tam: 28 }" />
                </span>
                <div>
                  <span class="nivel">{{ gerencia.nivel }}</span>
                  <h3>{{ gerencia.cargo }}</h3>
                </div>
              </div>
              <div class="resp">
                <span>Responsable</span>
                <strong>{{ gerencia.responsable }}</strong>
              </div>
              <p class="funcion"><b>Función:</b> {{ gerencia.funcion }}</p>
              <button type="button" class="ver">Ver detalle</button>
            </article>
          </div>

          <!-- ===== Nivel 2: áreas ===== -->
          <div class="hijos" [style.--n]="equipo.length">
            @for (r of equipo; track r.id; let i = $index) {
              <div class="hijo" [style.--i]="i">
                <article class="rol" [style.--acento]="r.acento" (click)="abrir(r)">
                  <span class="barra"></span>
                  <div class="rol-top">
                    <span class="ico">
                      <ng-container [ngTemplateOutlet]="icono"
                                    [ngTemplateOutletContext]="{ $implicit: r.icono, tam: 24 }" />
                    </span>
                    <div>
                      <span class="nivel">{{ r.nivel }}</span>
                      <h3>{{ r.cargo }}</h3>
                    </div>
                  </div>
                  <div class="resp">
                    <span>Responsable</span>
                    <strong>{{ r.responsable }}</strong>
                  </div>
                  <p class="funcion"><b>Función:</b> {{ r.funcion }}</p>
                  <button type="button" class="ver">Ver detalle</button>
                </article>
              </div>
            }
          </div>
        </div>
      </div>
    </section>

    <!-- ===== Ventana de detalle ===== -->
    <dialog #dialogo class="dialogo" aria-labelledby="dlg-titulo"
            (click)="cerrarFuera($event)" (close)="seleccionado.set(null)">
      @if (seleccionado(); as s) {
        <div class="dlg" [style.--acento]="s.acento">
          <button type="button" class="cerrar" aria-label="Cerrar" (click)="cerrar()">×</button>

          <div class="dlg-cab">
            <span class="dlg-ico">
              <ng-container [ngTemplateOutlet]="icono"
                            [ngTemplateOutletContext]="{ $implicit: s.icono, tam: 32 }" />
            </span>
            <div>
              <span class="badge">{{ s.nivel }}</span>
              <h3 id="dlg-titulo">{{ s.cargo }}</h3>
            </div>
          </div>

          <div class="resp">
            <span>Responsable</span>
            <strong>{{ s.responsable }}</strong>
          </div>

          <p class="dlg-texto">{{ s.funcion }}</p>

          <h4>Responsabilidades</h4>
          <ul class="checks">
            @for (x of s.responsabilidades; track x) { <li>{{ x }}</li> }
          </ul>

          @if (s.id !== gerencia.id) {
            <p class="reporta">Reporta a: <strong>{{ gerencia.cargo }}</strong></p>
          }

          <div class="dlg-nav">
            <button type="button" class="nav" (click)="navegar(-1)">‹ Anterior</button>
            <button type="button" class="nav" (click)="navegar(1)">Siguiente ›</button>
            <button type="button" class="sec" (click)="cerrar()">Cerrar</button>
          </div>
        </div>
      }
    </dialog>
  `,
  styles: [`
    :host { display: block; --oro: #e6c79c; --linea: #cdcdc7; }
    .band { background: var(--band); }

    /* ---------- Encabezado ---------- */
    .cab { display: grid; justify-items: center; gap: .6rem; margin-bottom: 2.5rem; text-align: center; }
    .cab h2 { font-size: clamp(1.4rem, 2.6vw, 1.9rem); font-weight: 800; text-transform: uppercase; }
    .cab p { margin: 0; max-width: 60ch; color: var(--muted); font-size: .95rem; }
    .pill { padding: .3rem .9rem; border-radius: 999px; background: var(--surface); border: 1px solid var(--line);
            font-size: .72rem; font-weight: 700; letter-spacing: .05em; text-transform: uppercase; color: var(--muted); }

    /* ---------- Tarjetas de rol ---------- */
    .rol { --acento: var(--brand); position: relative; display: flex; flex-direction: column; gap: .9rem; height: 100%;
           padding: 1.5rem; overflow: hidden; cursor: pointer; background: var(--surface); border: 1px solid var(--line);
           border-radius: 14px; box-shadow: 0 1px 2px rgba(0,0,0,.05), 0 6px 18px rgba(0,0,0,.05);
           transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease; }
    .rol:hover { transform: translateY(-4px); border-color: var(--acento);
                 box-shadow: 0 2px 4px rgba(0,0,0,.06), 0 14px 30px rgba(0,0,0,.11); }
    .barra { position: absolute; inset: 0 0 auto 0; height: 4px; background: var(--acento); }
    .lider .barra { height: 5px; background: linear-gradient(90deg, var(--brand), var(--oro)); }

    .rol-top { display: flex; align-items: center; gap: .9rem; margin-top: .25rem; }
    .ico { flex: none; width: 48px; height: 48px; display: grid; place-items: center; border-radius: 12px;
           color: var(--acento); background: color-mix(in srgb, var(--acento) 12%, transparent);
           transition: background .25s, color .25s, transform .25s; }
    .rol:hover .ico { background: var(--acento); color: #fff; transform: rotate(-5deg) scale(1.05); }
    .nivel { display: block; margin-bottom: .15rem; font-size: .68rem; font-weight: 800; text-transform: uppercase;
             letter-spacing: .06em; color: var(--muted); }
    .rol h3 { font-size: 1.05rem; font-weight: 800; line-height: 1.25; }

    .resp { display: grid; gap: .1rem; padding: .6rem .85rem; border-left: 3px solid var(--acento);
            border-radius: 0 8px 8px 0; background: var(--bg); }
    .resp span { font-size: .68rem; font-weight: 800; text-transform: uppercase; letter-spacing: .05em; color: var(--muted); }
    .resp strong { font-size: .9rem; color: var(--ink); }

    .funcion { margin: 0; font-size: .88rem; line-height: 1.6; color: var(--muted);
               display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 4; line-clamp: 4; overflow: hidden; }
    .funcion b { color: var(--ink); }
    .ver { margin-top: auto; align-self: flex-start; padding: .2rem 0; background: none; border: 0; font: inherit;
           font-size: .85rem; font-weight: 700; color: var(--acento); cursor: pointer; }
    .ver::after { content: ' ›'; }
    .rol:hover .ver { text-decoration: underline; }

    /* ---------- Organigrama ---------- */
    .padre { position: relative; display: flex; justify-content: center; padding-bottom: 2.25rem; }
    .padre .rol { max-width: 580px; width: 100%; }
    .padre::after { content: ''; position: absolute; left: 50%; bottom: 0; width: 2px; height: 2.25rem; margin-left: -1px;
                    background: var(--linea); transition: background .25s; transform-origin: top; }

    .hijos { display: grid; grid-template-columns: repeat(var(--n, 3), minmax(0, 1fr)); }
    .hijo { position: relative; padding: 2.25rem .75rem 0; }
    /* barra horizontal que une a los hijos */
    .hijo::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: var(--linea);
                    transition: background .25s; }
    .hijo:first-child::before { left: 50%; }
    .hijo:last-child::before { right: 50%; }
    .hijo:only-child::before { display: none; }
    /* tramo vertical hacia la tarjeta */
    .hijo::after { content: ''; position: absolute; top: 0; left: 50%; width: 2px; height: 2.25rem; margin-left: -1px;
                   background: var(--linea); transition: background .25s; transform-origin: top; }

    /* resalta la rama al pasar el mouse */
    .hijo:hover::before, .hijo:hover::after,
    .org:has(.hijo:hover) .padre::after { background: var(--brand); }

    /* ---------- Entrada ---------- */
    .org:not(.visible) .rol,
    .org:not(.visible) .padre::after,
    .org:not(.visible) .hijo::after { opacity: 0; }
    .org.visible .padre .rol { animation: subir .55s ease backwards; }
    .org.visible .padre::after { animation: trazar .4s .45s ease backwards; }
    .org.visible .hijo::before { animation: trazarX .5s .8s ease backwards; }
    .org.visible .hijo::after { animation: trazar .35s calc(.9s + var(--i, 0) * .12s) ease backwards; }
    .org.visible .hijo .rol { animation: subir .55s calc(1.1s + var(--i, 0) * .14s) ease backwards; }
    @keyframes subir  { from { opacity: 0; transform: translateY(18px); } }
    @keyframes trazar { from { transform: scaleY(0); } }
    @keyframes trazarX { from { transform: scaleX(0); } }

    /* ---------- Responsive ---------- */
    @media (max-width: 960px) {
      .hijos { grid-template-columns: 1fr; }
      .hijo { padding: 1.5rem 0 0; }
      .hijo::before { display: none; }
      .hijo::after { height: 1.5rem; }
      .padre { padding-bottom: 1.5rem; }
      .padre::after { height: 1.5rem; }
    }

    /* ---------- Ventana de detalle ---------- */
    .dialogo { border: 0; border-radius: 12px; padding: 0; width: min(580px, 92vw); overflow: hidden;
               color: var(--ink); box-shadow: 0 20px 60px rgba(0,0,0,.35); }
    .dialogo::backdrop { background: rgba(20,20,20,.55); }
    .dialogo[open] { animation: entrar .25s ease; }
    @keyframes entrar { from { opacity: 0; transform: translateY(12px) scale(.98); } }

    .dlg { --acento: var(--brand); position: relative; display: grid; gap: 1rem; padding: 1.75rem; max-height: 88vh; overflow-y: auto;
           border-top: 4px solid var(--acento); }
    .cerrar { position: absolute; top: .6rem; right: .8rem; width: 36px; height: 36px; border: 0; border-radius: 50%;
              background: none; font-size: 1.7rem; line-height: 1; color: var(--muted); cursor: pointer; }
    .cerrar:hover { background: var(--band); color: var(--ink); }
    .dlg-cab { display: flex; gap: 1rem; align-items: center; padding-right: 2rem; }
    .dlg-ico { flex: none; width: 60px; height: 60px; display: grid; place-items: center; border-radius: 50%;
               color: var(--acento); background: color-mix(in srgb, var(--acento) 12%, transparent); }
    .badge { display: inline-block; padding: .15rem .55rem; border-radius: 3px; background: var(--acento); color: #fff;
             font-size: .7rem; font-weight: 700; text-transform: uppercase; letter-spacing: .03em; }
    .dlg-cab h3 { font-size: 1.2rem; font-weight: 800; line-height: 1.25; margin-top: .3rem; }
    .dlg-texto { margin: 0; font-size: .95rem; line-height: 1.7; color: var(--muted); }
    .dlg h4 { font-size: .8rem; font-weight: 800; text-transform: uppercase; letter-spacing: .04em; margin: .25rem 0 -.3rem; }

    .checks { list-style: none; margin: 0; padding: 0; display: grid; gap: .55rem; }
    .checks li { display: flex; gap: .6rem; align-items: flex-start; font-size: .92rem; }
    .checks li::before {
      content: ''; flex: none; width: 18px; height: 18px; margin-top: .15rem; border-radius: 50%;
      background: var(--acento) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 12l5 5 9-10'/%3E%3C/svg%3E") center / 11px no-repeat;
    }
    .reporta { margin: 0; font-size: .85rem; color: var(--muted); }
    .reporta strong { color: var(--ink); }

    .dlg-nav { display: flex; flex-wrap: wrap; gap: .6rem; align-items: center; margin-top: .25rem; padding-top: 1rem;
               border-top: 1px solid var(--line); }
    .nav, .sec { padding: .65rem 1rem; background: none; border: 1px solid var(--line); border-radius: 4px; font: inherit;
                 font-size: .85rem; font-weight: 600; cursor: pointer; }
    .nav:hover, .sec:hover { background: var(--band); }
    .sec { margin-left: auto; }
  `],
})
export class EstructuraOrganizacionalComponent {
  cab = CABECERA;
  gerencia = GERENCIA;
  equipo = EQUIPO;

  visible = signal(false);
  seleccionado = signal<RolEquipo | null>(null);

  private todos: RolEquipo[] = [GERENCIA, ...EQUIPO];
  private dialogo = viewChild.required<ElementRef<HTMLDialogElement>>('dialogo');
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

  abrir(rol: RolEquipo): void {
    this.seleccionado.set(rol);
    const d = this.dialogo().nativeElement;
    if (!d.open) d.showModal();
  }

  /** Pasa al rol anterior o siguiente sin cerrar la ventana. */
  navegar(dir: 1 | -1): void {
    const actual = this.seleccionado();
    if (!actual) return;
    const n = this.todos.length;
    const i = (this.todos.findIndex((r) => r.id === actual.id) + dir + n) % n;
    this.seleccionado.set(this.todos[i]);
  }

  cerrar(): void {
    this.dialogo().nativeElement.close();
  }

  cerrarFuera(ev: MouseEvent): void {
    if (ev.target === this.dialogo().nativeElement) this.cerrar();
  }
}

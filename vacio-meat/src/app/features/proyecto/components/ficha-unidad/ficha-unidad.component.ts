import { Component, ElementRef, signal, viewChild } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { urlWhatsapp } from '../../../../core/config/contacto';
import { BLOQUES, BloqueFicha, CABECERA, DatoFicha } from '../../data/ficha-unidad.data';

@Component({
  selector: 'app-ficha-unidad',
  standalone: true,
  imports: [NgTemplateOutlet],
  template: `
    <!-- Ícono de cada bloque (se reutiliza en la tarjeta y en la ventana) -->
    <ng-template #icono let-nombre let-tam="tam">
      <svg viewBox="0 0 24 24" [attr.width]="tam" [attr.height]="tam" fill="none" stroke="currentColor"
           stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        @switch (nombre) {
          @case ('granja') { <path d="M3 11l9-7 9 7v9H3z"/><path d="M9 20v-6h6v6"/> }
          @case ('valor') { <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/> }
          @case ('proceso') {
            <circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/>
            <path d="M7 12h3M14 12h3"/>
          }
          @case ('higiene') { <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/> }
        }
      </svg>
    </ng-template>

    <section class="section">
      <div class="wrap">
        <header class="cabecera">
          <h2>{{ cab.titulo }}</h2>
          <p class="sub"><strong>{{ cab.nombre }}</strong> · {{ cab.ubicacion }}</p>
          <p class="eslogan">“{{ cab.eslogan }}”</p>
        </header>

        <div class="grid" id="ficha-contenido">
          @for (b of bloques; track b.numero) {
            <article class="card" (click)="abrir(b)">
              <header class="cab-card">
                <span class="num" aria-hidden="true">{{ b.numero }}</span>
                <h3>{{ b.titulo }}</h3>
                <span class="ico">
                  <ng-container [ngTemplateOutlet]="icono"
                                [ngTemplateOutletContext]="{ $implicit: b.icono, tam: 22 }" />
                </span>
              </header>

              @if (b.intro) { <p class="intro">{{ b.intro }}</p> }

              <ul class="lista" [class.pasos]="b.ordenado">
                @for (d of visibles(b); track d.texto; let i = $index) {
                  <li [class.extra]="i >= limite">
                    @if (d.rotulo) { <strong>{{ d.rotulo }}:</strong> }
                    {{ d.texto }}
                  </li>
                }
              </ul>

              <button type="button" class="ver">Ver detalle</button>
            </article>
          }
        </div>

        <div class="mas">
          <button type="button" class="btn-mas" [attr.aria-expanded]="completa()"
                  aria-controls="ficha-contenido" (click)="completa.set(!completa())">
            {{ completa() ? 'Ver menos' : 'Ver ficha completa ' }}
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor"
                 stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"
                 [class.girado]="completa()">
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </button>
        </div>
      </div>
    </section>

    <!-- ===== Ventana de detalle ===== -->
    <dialog #dialogo class="dialogo" aria-labelledby="dlg-titulo"
            (click)="cerrarFuera($event)" (close)="seleccionado.set(null)">
      @if (seleccionado(); as s) {
        <div class="dlg">
          <button type="button" class="cerrar" aria-label="Cerrar" (click)="cerrar()">×</button>

          <div class="dlg-cab">
            <span class="dlg-ico">
              <ng-container [ngTemplateOutlet]="icono"
                            [ngTemplateOutletContext]="{ $implicit: s.icono, tam: 34 }" />
            </span>
            <div>
              <span class="badge" [class]="'badge n' + s.numero">Sección {{ s.numero }}</span>
              <h3 id="dlg-titulo">{{ s.titulo }}</h3>
            </div>
          </div>

          @if (s.intro) { <p class="dlg-texto">{{ s.intro }}</p> }

          <ul class="lista grande" [class.pasos]="s.ordenado">
            @for (d of s.items; track d.texto) {
              <li>
                @if (d.rotulo) { <strong>{{ d.rotulo }}:</strong> }
                {{ d.texto }}
              </li>
            }
          </ul>
         
        </div>
      }
    </dialog>
  `,
  styles: [`
    :host { display: block; }

    .cabecera { text-align: center; margin-bottom: 2rem; }
    .cabecera h2 { font-size: clamp(1.4rem, 2.6vw, 1.9rem); font-weight: 800; text-transform: uppercase; margin-bottom: .6rem; }
    .sub { margin: 0; color: var(--muted); }
    .sub strong { color: var(--ink); }
    .eslogan { margin: .3rem 0 0; font-style: italic; color: var(--brand); font-weight: 500; }

    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem; align-items: stretch; }

    .card {
      display: flex; flex-direction: column; gap: .9rem; padding: 1.25rem; cursor: pointer;
      background: var(--surface); border: 1px solid var(--line); border-top: 3px solid var(--brand);
      border-radius: var(--radius);
      box-shadow: 0 1px 2px rgba(0,0,0,.05), 0 6px 18px rgba(0,0,0,.05);
      transition: transform .25s ease, box-shadow .25s ease;
    }
    .card:hover { transform: translateY(-3px); box-shadow: 0 2px 4px rgba(0,0,0,.06), 0 14px 30px rgba(0,0,0,.1); }

    .cab-card { display: flex; align-items: center; gap: .65rem; min-height: 4.2rem;
                padding-bottom: .8rem; border-bottom: 1px solid var(--line); }
    .num { flex: none; width: 28px; height: 28px; display: grid; place-items: center; border-radius: 50%;
           background: var(--brand); color: #fff; font-size: .85rem; font-weight: 800; }
    h3 { flex: 1; font-size: .95rem; font-weight: 800; line-height: 1.3; }
    .ico { flex: none; width: 40px; height: 40px; display: grid; place-items: center; border-radius: 50%;
           background: color-mix(in srgb, var(--wood) 12%, transparent); color: var(--wood);
           transition: background .25s, color .25s; }
    .card:hover .ico { background: var(--brand); color: #fff; }

    .intro { margin: 0; font-size: .85rem; line-height: 1.6; color: var(--muted); }

    .lista { list-style: none; margin: 0; padding: 0; display: grid; gap: .7rem; counter-reset: paso; }
    .lista li { font-size: .85rem; line-height: 1.6; color: var(--muted); }
    .lista strong { color: var(--ink); font-weight: 700; }
    .lista.grande li { font-size: .92rem; }

    .lista.pasos li { position: relative; padding-left: 1.9rem; counter-increment: paso; }
    .lista.pasos li::before {
      content: counter(paso); position: absolute; left: 0; top: .1rem; width: 20px; height: 20px;
      display: grid; place-items: center; border-radius: 50%;
      background: color-mix(in srgb, var(--brand) 12%, transparent); color: var(--brand);
      font-size: .72rem; font-weight: 800;
    }

    .lista li.extra { animation: aparecer .35s ease; }
    @keyframes aparecer { from { opacity: 0; transform: translateY(8px); } }

    .ver { margin-top: auto; align-self: flex-start; padding: .2rem 0; background: none; border: 0;
           font: inherit; font-size: .85rem; font-weight: 700; color: var(--brand); cursor: pointer; }
    .ver::after { content: ' ›'; }
    .card:hover .ver { text-decoration: underline; }

    .mas { display: flex; justify-content: center; margin-top: 1.75rem; }
    .btn-mas {
      display: inline-flex; align-items: center; gap: .45rem; padding: .7rem 1.4rem;
      background: var(--surface); color: var(--brand); border: 1.5px solid var(--brand); border-radius: 999px;
      font: inherit; font-size: .88rem; font-weight: 700; cursor: pointer;
      transition: background .2s, color .2s;
    }
    .btn-mas:hover { background: var(--brand); color: #fff; }
    .btn-mas svg { transition: transform .3s ease; }
    .btn-mas svg.girado { transform: rotate(180deg); }

    /* ---------- Ventana de detalle ---------- */
    .dialogo { border: 0; border-radius: 12px; padding: 0; width: min(620px, 92vw); overflow: hidden;
               color: var(--ink); box-shadow: 0 20px 60px rgba(0,0,0,.35); }
    .dialogo::backdrop { background: rgba(20,20,20,.55); }
    .dialogo[open] { animation: entrar .25s ease; }
    @keyframes entrar { from { opacity: 0; transform: translateY(12px) scale(.98); } }

    .dlg { position: relative; display: grid; gap: 1.1rem; padding: 1.75rem; max-height: 88vh; overflow-y: auto; }
    .cerrar { position: absolute; top: .6rem; right: .8rem; width: 36px; height: 36px; border: 0; border-radius: 50%;
              background: none; font-size: 1.7rem; line-height: 1; color: var(--muted); cursor: pointer; }
    .cerrar:hover { background: var(--band); color: var(--ink); }
    .dlg-cab { display: flex; gap: 1rem; align-items: center; padding-right: 2rem; }
    .dlg-ico { flex: none; width: 60px; height: 60px; display: grid; place-items: center; border-radius: 50%;
               background: color-mix(in srgb, var(--wood) 12%, transparent); color: var(--wood); }
    .dlg-cab h3 { flex: none; font-size: 1.2rem; font-weight: 800; line-height: 1.25; margin-top: .3rem; }
    .dlg-texto { margin: 0; font-size: .95rem; line-height: 1.7; color: var(--muted); }

    .badge { display: inline-block; padding: .15rem .5rem; border-radius: 3px; color: #fff;
             font-size: .7rem; font-weight: 700; text-transform: uppercase; letter-spacing: .03em; }
    .badge.n1 { background: var(--brand); }
    .badge.n2 { background: var(--wood); }
    .badge.n3 { background: #1b7f4b; }
    .badge.n4 { background: #4a4a46; }

    .dlg-acc { display: flex; flex-wrap: wrap; gap: .75rem; align-items: center; margin-top: .25rem; }
    .sec { padding: .85rem 1.2rem; background: none; border: 1px solid var(--line); border-radius: 4px;
           font: inherit; font-size: .85rem; font-weight: 600; cursor: pointer; }
    .sec:hover { background: var(--band); }
  `],
})
export class FichaUnidadComponent {
  cab = CABECERA;
  bloques = BLOQUES;
  readonly limite = 3;
  completa = signal(false);
  seleccionado = signal<BloqueFicha | null>(null);

  private dialogo = viewChild.required<ElementRef<HTMLDialogElement>>('dialogo');

  /** Datos que se ocultan en la vista resumida. */
  extra = BLOQUES.reduce((n, b) => n + Math.max(0, b.items.length - this.limite), 0);

  visibles(b: BloqueFicha): DatoFicha[] {
    return this.completa() ? b.items : b.items.slice(0, this.limite);
  }

  whatsapp(b: BloqueFicha): string {
    return urlWhatsapp(`Hola, quiero más información sobre: ${b.titulo}.`);
  }

  abrir(b: BloqueFicha): void {
    this.seleccionado.set(b);
    const d = this.dialogo().nativeElement;
    if (!d.open) d.showModal();
  }

  cerrar(): void {
    this.dialogo().nativeElement.close();
  }

  cerrarFuera(ev: MouseEvent): void {
    if (ev.target === this.dialogo().nativeElement) this.cerrar();
  }
}
import {
  afterNextRender, Component, DestroyRef, ElementRef, inject, signal, viewChild,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { TituloSeccionComponent } from '../../../../shared/ui/titulo-seccion/titulo-seccion.component';
import { urlWhatsapp } from '../../../../core/config/contacto';
import { COMPLEMENTOS, PRINCIPAL } from '../../data/ficha.data';
import { FichaItem } from '../../data/ficha.model';
import { IconoFichaComponent } from '../icono-ficha/icono-ficha.component';

@Component({
  selector: 'app-ficha-producto',
  standalone: true,
  imports: [TituloSeccionComponent, IconoFichaComponent, NgTemplateOutlet],
  template: `
    <!-- Imagen o ícono + insignia (se reutiliza en las dos zonas) -->
    <ng-template #medio let-item let-tam="tam">
      <span class="badge" [class]="'badge cat-' + item.categoria">{{ item.etiqueta }}</span>
      @if (conImagen(item)) {
        <img [src]="item.imagen" [alt]="item.titulo" loading="lazy" (error)="falloImagen(item.id)">
      } @else {
        <app-icono-ficha [nombre]="item.icono" [tam]="tam" />
      }
    </ng-template>

    <section class="section">
      <div class="wrap">
        <app-titulo-seccion>Producto, servicio e innovación</app-titulo-seccion>

        <div class="ficha">
          <!-- ===== Panel izquierdo: producto principal ===== -->
          <article class="panel principal">
            <h2>Producto principal</h2>

            <div class="media">
              <ng-container [ngTemplateOutlet]="medio"
                            [ngTemplateOutletContext]="{ $implicit: principal, tam: 88 }" />
            </div>

            <h3 class="titulo">{{ principal.titulo }}</h3>
            <p class="resumen">{{ principal.resumen }}</p>
            <div class="etqs">
              @for (e of principal.etiquetas; track e) { <span class="etq">{{ e }}</span> }
            </div>

            <div class="acciones">
              <button type="button" class="ver" (click)="abrir(principal)">Ver detalle</button>
            </div>
          </article>

          <!-- ===== Panel derecho: carrusel ===== -->
          <section class="panel panel-carrusel" aria-label="Portafolio y valor agregado">
            <header class="enc">
              <h2>Portafolio y valor agregado</h2>
              <button type="button" class="enlace" (click)="irA(complementos.length - 1)">
                Ver ficha técnica
              </button>

              @if (hayDesborde()) {
                <div class="puntos" role="group" aria-label="Ir a la tarjeta">
                  @for (c of complementos; track c.id; let i = $index) {
                    <button type="button" class="punto" [class.on]="activo() === i"
                            [attr.aria-label]="'Ir a ' + c.titulo"
                            [attr.aria-current]="activo() === i" (click)="irA(i)"></button>
                  }
                </div>
              }
            </header>

            <div class="carrusel">
              @if (puedeAtras()) {
                <button type="button" class="flecha ant" aria-label="Anterior" (click)="mover(-1)">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor"
                       stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M15 5l-7 7 7 7"/>
                  </svg>
                </button>
              }

              <div class="pista" #pista tabindex="0" role="region" aria-label="Tarjetas de portafolio"
                   (scroll)="actualizar()">
                @for (c of complementos; track c.id) {
                  <article class="tarjeta" (click)="abrir(c)">
                    <div class="media">
                      <ng-container [ngTemplateOutlet]="medio"
                                    [ngTemplateOutletContext]="{ $implicit: c, tam: 52 }" />
                    </div>
                    <h3 class="t-titulo">{{ c.titulo }}</h3>
                    <p class="t-texto">{{ c.resumen }}</p>
                    <div class="etqs">
                      @for (e of c.etiquetas; track e) { <span class="etq">{{ e }}</span> }
                    </div>
                    <button type="button" class="ver">Ver detalle</button>
                  </article>
                }
              </div>

              @if (puedeAdelante()) {
                <button type="button" class="flecha sig" aria-label="Siguiente" (click)="mover(1)">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor"
                       stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M9 5l7 7-7 7"/>
                  </svg>
                </button>
              }
            </div>
          </section>
        </div>
      </div>
    </section>

    <!-- ===== Detalle ===== -->
    <dialog #dialogo class="dialogo" aria-labelledby="dlg-titulo"
            (click)="cerrarFuera($event)" (close)="seleccionado.set(null)">
      @if (seleccionado(); as s) {
        <div class="dlg">
          <button type="button" class="cerrar" aria-label="Cerrar" (click)="cerrar()">×</button>

          <div class="dlg-cab">
            <span class="dlg-ico"><app-icono-ficha [nombre]="s.icono" [tam]="34" /></span>
            <div>
              <span class="badge" [class]="'badge cat-' + s.categoria">{{ s.etiqueta }}</span>
              <h3 id="dlg-titulo">{{ s.titulo }}</h3>
            </div>
          </div>

          <p class="dlg-texto">{{ s.texto }}</p>

          @if (s.lista; as lista) {
            <h4>{{ s.tituloLista }}</h4>
            <ul class="checks">
              @for (v of lista; track v) { <li>{{ v }}</li> }
            </ul>
          }

          <div class="etqs">
            @for (e of s.etiquetas; track e) { <span class="etq">{{ e }}</span> }
          </div>
        
        </div>
      }
    </dialog>
  `,
  styles: [`
    :host { display: block; }

    .ficha { display: grid; grid-template-columns: minmax(0, 320px) minmax(0, 1fr); gap: 1.25rem; align-items: stretch; }
    .panel { background: var(--surface); border-radius: 10px; padding: 1.5rem; min-width: 0;
             box-shadow: 0 1px 3px rgba(0,0,0,.12); }
    .panel h2 { font-size: 1.15rem; font-weight: 700; margin: 0; line-height: 1.5rem; }

    /* ---------- Insignias, chips, checks ---------- */
    .badge { position: relative; z-index: 1; display: inline-block; padding: .15rem .5rem; border-radius: 3px;
             color: #fff; font-size: .7rem; font-weight: 700; text-transform: uppercase; letter-spacing: .03em;
             background: var(--cat, var(--brand)); }
    .cat-producto   { --cat: var(--brand); }
    .cat-servicio   { --cat: var(--wood); }
    .cat-innovacion { --cat: #1b7f4b; }
    .cat-equipos    { --cat: #4a4a46; }

    .etqs { display: flex; flex-wrap: wrap; gap: .35rem; }
    .etq { font-size: .75rem; font-weight: 600; color: #1b7f4b; background: #e8f5ee;
           padding: .15rem .55rem; border-radius: 999px; }

    .checks { list-style: none; margin: 0; padding: 0; display: grid; gap: .55rem; }
    .checks li { display: flex; gap: .6rem; align-items: flex-start; font-size: .9rem; }
    .checks li::before {
      content: ''; flex: none; width: 18px; height: 18px; margin-top: .12rem; border-radius: 50%;
      background: var(--brand) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 12l5 5 9-10'/%3E%3C/svg%3E") center / 11px no-repeat;
    }

    /* ---------- Imagen / ícono ---------- */
    .media { position: relative; display: grid; place-items: center; overflow: hidden;
             background: #f1f1ef; border-radius: 6px; color: var(--wood); }
    .media .badge { position: absolute; top: .6rem; left: .6rem; }
    .media img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }

    /* ---------- Panel principal ---------- */
    .principal { display: flex; flex-direction: column; gap: .75rem; }
    .principal .media { aspect-ratio: 16 / 10; }
    .titulo { font-size: 1.05rem; font-weight: 600; line-height: 1.3; }
    .resumen { margin: 0; font-size: .9rem; line-height: 1.6; color: var(--muted); }
    .acciones { margin-top: auto; display: grid; gap: .6rem; padding-top: .25rem; }
    .cta { text-align: center; }

    /* ---------- Encabezado del carrusel ---------- */
    .enc { display: flex; align-items: center; flex-wrap: wrap; gap: .5rem 1.1rem; margin-bottom: .85rem; }
    .enlace { background: none; border: 0; padding: 0; font: inherit; font-size: .9rem; font-weight: 600;
              line-height: 1.5rem; color: var(--brand); cursor: pointer; }
    .enlace:hover { text-decoration: underline; }
    .puntos { display: flex; gap: .35rem; margin-left: auto; }
    .punto { width: 8px; height: 8px; padding: 0; border: 0; border-radius: 50%; background: #d4d4cf;
             cursor: pointer; transition: background .2s, transform .2s; }
    .punto.on { background: var(--brand); transform: scale(1.25); }

    /* ---------- Carrusel ---------- */
    .panel-carrusel { display: flex; flex-direction: column; }
    .carrusel { position: relative; flex: 1; display: flex; min-height: 0; }
    .pista { position: relative; flex: 1; min-width: 0; display: flex; gap: 1rem; overflow-x: auto;
             scroll-snap-type: x mandatory; scrollbar-width: none; padding-bottom: .25rem; }
    .pista::-webkit-scrollbar { display: none; }

    .tarjeta { flex: 0 0 max(180px, calc((100% - 2rem) / 3.4)); scroll-snap-align: start; display: flex;
               flex-direction: column; gap: .6rem; cursor: pointer; }
    /* la imagen absorbe la altura sobrante para que ambos paneles queden parejos */
    .tarjeta .media { flex: 1 1 150px; min-height: 150px; }
    .tarjeta .media svg, .tarjeta .media img { transition: transform .3s ease; }
    .tarjeta:hover .media svg { transform: scale(1.1) rotate(-4deg); }
    .tarjeta:hover .media img { transform: scale(1.05); }
    .t-titulo { font-size: .95rem; font-weight: 600; line-height: 1.3; min-height: 2.6em; transition: color .2s; }
    .tarjeta:hover .t-titulo { color: var(--brand); }
    .t-texto { margin: 0; font-size: .82rem; line-height: 1.5; color: var(--muted); min-height: 4.5em;
               display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 3; line-clamp: 3;
               overflow: hidden; }

    .ver { align-self: flex-start; padding: .2rem 0; background: none; border: 0;
           font: inherit; font-size: .85rem; font-weight: 700; color: var(--brand); cursor: pointer; }
    .tarjeta .ver { margin-top: auto; }
    .ver::after { content: ' ›'; }
    .tarjeta:hover .ver, .ver:hover { text-decoration: underline; }

    .flecha { position: absolute; top: 30%; margin-top: -24px; z-index: 2; width: 48px; height: 48px; border: 0;
              border-radius: 50%; display: grid; place-items: center; background: #fff; color: var(--brand);
              box-shadow: 0 2px 10px rgba(0,0,0,.25); cursor: pointer; transition: transform .2s, background .2s; }
    .flecha:hover { transform: scale(1.08); background: #f4f9fa; }
    .flecha.sig { right: -1rem; }
    .flecha.ant { left: -1rem; }

    /* ---------- Diálogo ---------- */
    .dialogo { border: 0; border-radius: 12px; padding: 0; width: min(560px, 92vw); max-height: 88vh;
               color: var(--ink); box-shadow: 0 20px 60px rgba(0,0,0,.35); }
    .dialogo::backdrop { background: rgba(20,20,20,.55); }
    .dialogo[open] { animation: entrar .25s ease; }
    @keyframes entrar { from { opacity: 0; transform: translateY(12px) scale(.98); } }

    .dlg { position: relative; display: grid; gap: 1rem; padding: 1.75rem; }
    .cerrar { position: absolute; top: .6rem; right: .8rem; width: 36px; height: 36px; border: 0; border-radius: 50%;
              background: none; font-size: 1.7rem; line-height: 1; color: var(--muted); cursor: pointer; }
    .cerrar:hover { background: var(--band); color: var(--ink); }
    .dlg-cab { display: flex; gap: 1rem; align-items: center; padding-right: 2rem; }
    .dlg-ico { flex: none; width: 60px; height: 60px; display: grid; place-items: center; border-radius: 50%;
               background: color-mix(in srgb, var(--wood) 12%, transparent); color: var(--wood); }
    .dlg-cab h3 { font-size: 1.2rem; font-weight: 800; margin-top: .3rem; }
    .dlg-texto { margin: 0; font-size: .95rem; line-height: 1.7; color: var(--muted); }
    .dlg h4 { font-size: .8rem; font-weight: 800; text-transform: uppercase; letter-spacing: .04em; margin: .25rem 0 -.3rem; }
    .dlg-acc { display: flex; flex-wrap: wrap; gap: .75rem; align-items: center; margin-top: .25rem; }
    .sec { padding: .85rem 1.2rem; background: none; border: 1px solid var(--line); border-radius: 4px;
           font: inherit; font-size: .85rem; font-weight: 600; cursor: pointer; }
    .sec:hover { background: var(--band); }

    /* ---------- Responsive ---------- */
    @media (max-width: 900px) {
      .ficha { grid-template-columns: 1fr; }
      .flecha.sig { right: -.6rem; }
      .flecha.ant { left: -.6rem; }
    }
    @media (max-width: 520px) {
      .panel { padding: 1.15rem; }
      .tarjeta { flex-basis: 78%; }
      .flecha { width: 40px; height: 40px; margin-top: -20px; }
    }
  `],
})
export class FichaProductoComponent {
  principal = PRINCIPAL;
  complementos = COMPLEMENTOS;

  seleccionado = signal<FichaItem | null>(null);
  activo = signal(0);
  puedeAtras = signal(false);
  puedeAdelante = signal(false);
  hayDesborde = signal(false);
  private fallos = signal<string[]>([]);

  private pista = viewChild.required<ElementRef<HTMLElement>>('pista');
  private dialogo = viewChild.required<ElementRef<HTMLDialogElement>>('dialogo');
  private destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      this.actualizar();
      const ro = new ResizeObserver(() => this.actualizar());
      ro.observe(this.pista().nativeElement);
      this.destroyRef.onDestroy(() => ro.disconnect());
    });
  }

  whatsapp(item: FichaItem): string {
    return urlWhatsapp(`Hola, quiero información sobre: ${item.titulo}.`);
  }

  // ---------- Imágenes (si una no existe, se muestra el ícono) ----------
  conImagen(item: FichaItem): boolean {
    return !!item.imagen && !this.fallos().includes(item.id);
  }

  falloImagen(id: string): void {
    this.fallos.update((f) => [...f, id]);
  }

  // ---------- Carrusel ----------
  private suave(): ScrollBehavior {
    return matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
  }

  mover(dir: 1 | -1): void {
    const el = this.pista().nativeElement;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: this.suave() });
  }

  irA(indice: number): void {
    const el = this.pista().nativeElement;
    const hijo = el.children[indice] as HTMLElement | undefined;
    if (hijo) el.scrollTo({ left: hijo.offsetLeft, behavior: this.suave() });
  }

  actualizar(): void {
    const el = this.pista().nativeElement;
    const max = el.scrollWidth - el.clientWidth;
    this.hayDesborde.set(max > 4);
    this.puedeAtras.set(el.scrollLeft > 4);
    this.puedeAdelante.set(el.scrollLeft < max - 4);

    let activo = 0;
    let menor = Infinity;
    Array.from(el.children).forEach((h, i) => {
      const d = Math.abs((h as HTMLElement).offsetLeft - el.scrollLeft);
      if (d < menor) { menor = d; activo = i; }
    });
    this.activo.set(max > 4 && el.scrollLeft >= max - 4 ? el.children.length - 1 : activo);
  }

  // ---------- Diálogo ----------
  abrir(item: FichaItem): void {
    this.seleccionado.set(item);
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

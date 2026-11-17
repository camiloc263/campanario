import { Component, ElementRef, computed, effect, inject, signal, viewChildren } from '@angular/core';
import { ENCUESTA, PREGUNTAS } from '../data/encuesta.data';

type Estado = 'editando' | 'enviando' | 'enviada' | 'error';

@Component({
  selector: 'app-encuesta-validacion',
  standalone: true,
  template: `
    <section class="section">
      <div class="wrap">
        <header class="cab">
          <h2>{{ info.titulo }}</h2>
          <p>{{ info.intro }}</p>
        </header>

        @if (estado() === 'enviada') {
          <!-- ===== Gracias ===== -->
          <div class="gracias" role="status">
            <span class="check-grande" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor"
                   stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10"/></svg>
            </span>
            <h3>¡Gracias por responder!</h3>
            <p>Tus respuestas nos ayudan a validar el mercado de la Granja Porcícola El Campanario.</p>

            <details class="resumen">
              <summary>Ver mis respuestas</summary>
              <ol>
                @for (r of resumen(); track r.pregunta) {
                  <li><span>{{ r.pregunta }}</span><strong>{{ r.respuesta }}</strong></li>
                }
              </ol>
            </details>

            <button type="button" class="btn" (click)="reiniciar()">Responder de nuevo</button>
          </div>
        } @else {
          <!-- ===== Preguntas ===== -->
          <div class="grid">
            @for (p of preguntas; track p.id; let i = $index) {
              <div class="card" #tarjeta
                   [class.ok]="!!respuestas()[p.id]"
                   [class.pend]="intentoFallido() && !respuestas()[p.id]">
                <div class="q-cab">
                  <span class="q-tag">Pregunta {{ i + 1 }} de {{ total }}</span>
                  <span class="estado" [class.on]="!!respuestas()[p.id]">
                    @if (respuestas()[p.id]) {
                      <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor"
                           stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M5 12l5 5 9-10"/>
                      </svg>
                      Respondida
                    } @else {
                      Pendiente
                    }
                  </span>
                </div>

                <h3 [id]="'q-' + p.id">{{ p.texto }}</h3>

                <div class="opciones" role="radiogroup" [attr.aria-labelledby]="'q-' + p.id">
                  @for (o of p.opciones; track o.valor) {
                    <label class="opcion" [class.sel]="respuestas()[p.id] === o.valor">
                      <input type="radio" [name]="p.id" [value]="o.valor"
                             [checked]="respuestas()[p.id] === o.valor"
                             (change)="responder(p.id, o.valor)">
                      <span>{{ o.texto }}</span>
                    </label>
                  }
                </div>
              </div>
            }
          </div>

          <!-- ===== Barra de progreso y envío ===== -->
          <div class="barra" [class.completa]="faltan() === 0">
            <div class="prog">
              <span class="prog-txt" aria-live="polite">{{ respondidas() }} de {{ total }} respondidas</span>
              <div class="pista" role="progressbar" aria-label="Progreso de la encuesta"
                   [attr.aria-valuenow]="respondidas()" aria-valuemin="0" [attr.aria-valuemax]="total">
                <span class="relleno" [style.width.%]="progreso()"></span>
              </div>
            </div>

            @if (respondidas() > 0) {
              <button type="button" class="limpiar" (click)="limpiar()">Limpiar</button>
            }
            <button type="button" class="btn" [disabled]="estado() === 'enviando'" (click)="enviar()">
              {{ estado() === 'enviando' ? 'Enviando…' : 'Enviar validación' }}
            </button>
          </div>

          @if (intentoFallido() && faltan() > 0) {
            <p class="msg aviso" role="alert">
              Te {{ faltan() === 1 ? 'falta' : 'faltan' }} {{ faltan() }}
              {{ faltan() === 1 ? 'pregunta' : 'preguntas' }} por responder.
            </p>
          }
          @if (estado() === 'error') {
            <p class="msg error" role="alert">
              No pudimos enviar tus respuestas. Revisa tu conexión e inténtalo de nuevo.
            </p>
          }
        }
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; }

    .cab { text-align: center; margin-bottom: 2.25rem; }
    .cab h2 { font-size: clamp(1.4rem, 2.6vw, 1.9rem); font-weight: 800; text-transform: uppercase; margin-bottom: .7rem; }
    .cab p { margin: 0 auto; max-width: 62ch; color: var(--muted); font-size: .95rem; }

    .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1.25rem; align-items: start; }

    /* ---------- Tarjeta de pregunta ---------- */
    .card { background: var(--surface); border: 1px solid var(--line); border-left: 4px solid var(--line);
            border-radius: var(--radius); padding: 1.25rem; box-shadow: 0 1px 3px rgba(0,0,0,.06);
            transition: border-color .3s ease, box-shadow .3s ease; }
    .card.ok { border-left-color: var(--brand); }
    .card.pend { border-color: #b3261e; border-left-color: #b3261e; box-shadow: 0 0 0 3px rgba(179,38,30,.12);
                 animation: sacudir .4s ease; }
    @keyframes sacudir { 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }

    .q-cab { display: flex; justify-content: space-between; align-items: center; gap: .5rem; margin-bottom: .55rem; }
    .q-tag { font-size: .72rem; font-weight: 700; text-transform: uppercase; letter-spacing: .04em; color: var(--muted); }
    .estado { display: inline-flex; align-items: center; gap: .3rem; padding: .12rem .55rem; border-radius: 999px;
              font-size: .72rem; font-weight: 700; background: var(--band); color: var(--muted);
              transition: background .3s, color .3s; }
    .estado.on { background: color-mix(in srgb, var(--brand) 12%, transparent); color: var(--brand); }

    h3 { font-size: .98rem; font-weight: 700; line-height: 1.4; margin-bottom: .95rem; }

    /* ---------- Opciones ---------- */
    .opciones { display: grid; gap: .5rem; }
    .opcion { display: flex; align-items: center; gap: .75rem; padding: .65rem .85rem; cursor: pointer;
              border: 1px solid var(--line); border-radius: 8px; background: var(--bg);
              font-size: .88rem; color: var(--ink);
              transition: background .2s, border-color .2s, color .2s, transform .15s; }
    .opcion:hover { border-color: var(--brand); background: color-mix(in srgb, var(--brand) 6%, var(--bg)); }
    .opcion:active { transform: scale(.99); }
    .opcion.sel { background: var(--brand); border-color: var(--brand); color: #fff; font-weight: 600; }
    .opcion:has(input:focus-visible) { outline: 3px solid var(--brand); outline-offset: 2px; }

    .opcion input { appearance: none; flex: none; width: 18px; height: 18px; margin: 0; display: grid;
                    place-content: center; border: 2px solid #b4b4ae; border-radius: 50%; background: #fff;
                    transition: border-color .2s; }
    .opcion input::before { content: ''; width: 8px; height: 8px; border-radius: 50%; background: var(--brand);
                            transform: scale(0); transition: transform .18s ease; }
    .opcion input:checked { border-color: #fff; }
    .opcion input:checked::before { transform: scale(1); }

    /* ---------- Barra inferior ---------- */
    .barra { position: sticky; bottom: 1rem; z-index: 5; display: flex; align-items: center; gap: 1rem;
             margin-top: 1.75rem; padding: .85rem 1.1rem; background: var(--surface); border: 1px solid var(--line);
             border-radius: 999px; box-shadow: 0 6px 24px rgba(0,0,0,.14); }
    .prog { flex: 1; min-width: 0; display: grid; gap: .35rem; }
    .prog-txt { font-size: .8rem; font-weight: 700; color: var(--muted); }
    .pista { height: 8px; border-radius: 999px; background: var(--band); overflow: hidden; }
    .relleno { display: block; height: 100%; border-radius: inherit; background: var(--brand);
               transition: width .4s ease, background .3s; }
    .barra.completa .relleno { background: #1b7f4b; }
    .barra.completa .prog-txt { color: #1b7f4b; }
    .limpiar { background: none; border: 0; padding: .4rem .6rem; font: inherit; font-size: .85rem; font-weight: 600;
               color: var(--muted); cursor: pointer; text-decoration: underline; }
    .limpiar:hover { color: var(--ink); }
    .btn[disabled] { opacity: .6; cursor: progress; }

    .msg { margin: 1rem 0 0; text-align: center; font-size: .9rem; font-weight: 600; }
    .msg.aviso, .msg.error { color: #b3261e; }

    /* ---------- Gracias ---------- */
    .gracias { display: grid; justify-items: center; gap: .9rem; max-width: 620px; margin: 0 auto; padding: 2.25rem 1.5rem;
               text-align: center; background: var(--surface); border: 1px solid var(--line);
               border-top: 3px solid #1b7f4b; border-radius: var(--radius);
               box-shadow: 0 6px 24px rgba(0,0,0,.08); animation: subir .5s ease; }
    @keyframes subir { from { opacity: 0; transform: translateY(14px); } }
    .check-grande { width: 72px; height: 72px; display: grid; place-items: center; border-radius: 50%;
                    background: #1b7f4b; color: #fff; animation: pop .5s cubic-bezier(.3, 1.6, .5, 1); }
    @keyframes pop { from { transform: scale(.3); opacity: 0; } }
    .gracias h3 { font-size: 1.4rem; font-weight: 800; margin: 0; }
    .gracias p { margin: 0; color: var(--muted); }
    .resumen { width: 100%; text-align: left; }
    .resumen summary { cursor: pointer; font-weight: 700; color: var(--brand); text-align: center; }
    .resumen ol { margin: 1rem 0 0; padding-left: 1.25rem; display: grid; gap: .6rem; font-size: .85rem; }
    .resumen li span { display: block; color: var(--muted); }
    .resumen li strong { color: var(--ink); }

    @media (max-width: 900px) { .grid { grid-template-columns: 1fr; } }
    @media (max-width: 520px) {
      .barra { border-radius: 16px; flex-wrap: wrap; }
      .prog { flex-basis: 100%; }
      .barra .btn { flex: 1; text-align: center; }
    }
  `],
})
export class EncuestaValidacionComponent {
  info = ENCUESTA;
  preguntas = PREGUNTAS;
  total = PREGUNTAS.length;

  respuestas = signal<Record<string, string>>(this.cargarBorrador());
  estado = signal<Estado>('editando');
  intentoFallido = signal(false);

  respondidas = computed(() => PREGUNTAS.filter((p) => !!this.respuestas()[p.id]).length);
  faltan = computed(() => this.total - this.respondidas());
  progreso = computed(() => Math.round((this.respondidas() / this.total) * 100));
  resumen = computed(() =>
    PREGUNTAS.map((p) => ({
      pregunta: p.texto,
      respuesta: p.opciones.find((o) => o.valor === this.respuestas()[p.id])?.texto ?? '—',
    })),
  );

  private tarjetas = viewChildren<ElementRef<HTMLElement>>('tarjeta');
  private host = inject(ElementRef<HTMLElement>);

  constructor() {
    // Guarda el progreso mientras se responde (se recupera si la persona recarga la página)
    effect(() => {
      const r = this.respuestas();
      if (this.estado() === 'editando') this.guardarBorrador(r);
    });
  }

  responder(id: string, valor: string): void {
    this.respuestas.update((r) => ({ ...r, [id]: valor }));
    if (this.estado() === 'error') this.estado.set('editando');
  }

  limpiar(): void {
    this.respuestas.set({});
    this.intentoFallido.set(false);
  }

  reiniciar(): void {
    this.limpiar();
    this.estado.set('editando');
    this.host.nativeElement.scrollIntoView({ behavior: this.suave(), block: 'start' });
  }

  async enviar(): Promise<void> {
    if (this.faltan() > 0) {
      this.intentoFallido.set(true);
      this.irAPrimeraPendiente();
      return;
    }

    this.estado.set('enviando');
    try {
      if (ENCUESTA.envioUrl) {
        const resp = await fetch(ENCUESTA.envioUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fecha: new Date().toISOString(), respuestas: this.respuestas() }),
        });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      } else {
        console.log('Respuestas de la encuesta:', this.respuestas());
      }
      this.borrarBorrador();
      this.estado.set('enviada');
      this.host.nativeElement.scrollIntoView({ behavior: this.suave(), block: 'start' });
    } catch {
      this.estado.set('error');
    }
  }

  // ---------- Utilidades ----------
  private irAPrimeraPendiente(): void {
    const i = PREGUNTAS.findIndex((p) => !this.respuestas()[p.id]);
    this.tarjetas()[i]?.nativeElement.scrollIntoView({ behavior: this.suave(), block: 'center' });
  }

  private suave(): ScrollBehavior {
    return matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
  }

  private cargarBorrador(): Record<string, string> {
    try {
      const crudo = localStorage.getItem(ENCUESTA.claveBorrador);
      if (!crudo) return {};
      const datos = JSON.parse(crudo) as Record<string, string>;
      const limpio: Record<string, string> = {};
      for (const p of PREGUNTAS) {
        if (p.opciones.some((o) => o.valor === datos[p.id])) limpio[p.id] = datos[p.id];
      }
      return limpio;
    } catch {
      return {};
    }
  }

  private guardarBorrador(r: Record<string, string>): void {
    try {
      if (Object.keys(r).length) localStorage.setItem(ENCUESTA.claveBorrador, JSON.stringify(r));
      else localStorage.removeItem(ENCUESTA.claveBorrador);
    } catch { /* almacenamiento no disponible */ }
  }

  private borrarBorrador(): void {
    try { localStorage.removeItem(ENCUESTA.claveBorrador); } catch { /* ignorar */ }
  }
}

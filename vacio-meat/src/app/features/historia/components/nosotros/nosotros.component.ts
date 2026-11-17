import { Component } from '@angular/core';

@Component({
  selector: 'app-nosotros',
  standalone: true,
  template: `
    <section class="section band">
      <div class="wrap grid">
        <div class="foto">
          <img src="images/historia/nosotros.png" alt="Carniceros de Linares cortando carne de cerdo en el taller"
               width="560" height="380" loading="lazy">
        </div>
        <div>
          <h1>LIDERAZGO Y UBICACIÓN</h1>
          <br>
          <h4>Líder / Representante: <p>Orlando Cuaran.</p></h4>
          <h4>Líder / Proyecto: <p>Granja Porcícola El Campanario.</p></h4>
          <h4>Ubicación propuesta: <p>Zona rural / finca en el municipio de Linares, Nariño.</p></h4>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .band { background: var(--band); }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center; }
    .foto { border-radius: var(--radius); overflow: hidden; aspect-ratio: 3 / 2; background: #cfcfca; }
    .foto img { width: 100%; height: 100%; object-fit: cover; }
    h1 { font-size: clamp(1.4rem, 2.6vw, 1.9rem); font-weight: 800; text-transform: uppercase; margin-bottom: 1rem; }
    p { color: var(--muted); max-width: 52ch; margin: 0 0 1rem; }
    @media (max-width: 760px) { .grid { grid-template-columns: 1fr; gap: 1.5rem; } }
  `],
})
export class NosotrosComponent { }

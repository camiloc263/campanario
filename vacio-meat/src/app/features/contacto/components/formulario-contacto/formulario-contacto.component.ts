import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { urlWhatsapp } from '../../../../core/config/contacto';

@Component({
  selector: 'app-formulario-contacto',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="enviar()" novalidate>
      <h2>Escríbenos tu pedido</h2>
      <label>Nombre
        <input formControlName="nombre" autocomplete="name">
        @if (invalido('nombre')) { <span class="error">Escribe tu nombre.</span> }
      </label>
      <label>Mensaje
        <textarea formControlName="mensaje" rows="5"
                  placeholder="Producto, cantidad y dirección de entrega"></textarea>
        @if (invalido('mensaje')) { <span class="error">Cuéntanos qué necesitas.</span> }
      </label>
      <button class="btn" type="submit">Enviar por WhatsApp</button>
    </form>
  `,
  styles: [`
    h2 { font-size: 1.1rem; font-weight: 700; margin-bottom: .2rem; }
    form { display: grid; gap: 1rem; }
    label { display: grid; gap: .35rem; font-size: .85rem; font-weight: 600; }
    input, textarea { font: inherit; padding: .7rem .8rem; border: 1px solid var(--line); border-radius: 6px; background: var(--surface); }
    .error { color: #a12a2a; font-weight: 500; font-size: .8rem; }
    .btn { justify-self: start; }
  `],
})
export class FormularioContactoComponent {
  private fb = inject(FormBuilder);
  private intentado = signal(false);

  form = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    mensaje: ['', [Validators.required, Validators.minLength(5)]],
  });

  invalido(campo: 'nombre' | 'mensaje'): boolean {
    const ctrl = this.form.controls[campo];
    return ctrl.invalid && (ctrl.touched || this.intentado());
  }

  enviar(): void {
    this.intentado.set(true);
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const { nombre, mensaje } = this.form.getRawValue();
    window.open(urlWhatsapp(`Hola, soy ${nombre}. ${mensaje}`), '_blank', 'noopener');
  }
}

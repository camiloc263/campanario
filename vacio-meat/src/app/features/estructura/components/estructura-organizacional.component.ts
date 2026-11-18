import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ESTRUCTURA_ORGANIZACIONAL_DATA } from '../data/estructura-organizacional.data';

@Component({
  selector: 'app-estructura-organizacional',
  standalone: true,
  imports: [CommonModule],
  template:
    ` 
    <div class="wrap-org">
      <!-- Encabezado Minimalista -->
      <div class="org-header">
        <div >
          <span class="badge-sec">{{ data.seccion }}</span>
          <h2>{{ data.titulo }}</h2>
        </div>
        <span class="badge-plan">{{ data.puntoPlan }}</span>
      </div>

      <!-- Barra Interactiva de Filtros -->
      <div class="interactive-bar">
        <button id="organizacional" class="filter-btn" [class.active]="filtroActivo === 'todos'" (click)="filtrar('todos')">Ver Todo</button>
        <button class="filter-btn" [class.active]="filtroActivo === 'direccion'" (click)="filtrar('direccion')">Dirección Estratégica</button>
        <button class="filter-btn" [class.active]="filtroActivo === 'produccion'" (click)="filtrar('produccion')">Producción y Planta</button>
        <button class="filter-btn" [class.active]="filtroActivo === 'administrativa'" (click)="filtrar('administrativa')">Gestión Administrativa</button>
      </div>

      <!-- Dirección General -->
      <div class="leader-card" [class.highlight-card]="filtroActivo === 'direccion'" *ngIf="mostrarDireccion" id="card-direccion">
        <div class="role-top">
          <div class="role-icon">{{ data.gerencia.icono }}</div>
          <div class="role-titles">
            <span class="level-pill">{{ data.gerencia.nivel }}</span>
            <h3>{{ data.gerencia.cargo }}</h3>
          </div>
        </div>
        <div class="responsable-box">
          <strong>Responsable:</strong> {{ data.gerencia.responsable }}
        </div>
        <p class="role-desc">
          {{ data.gerencia.funcion }}
        </p>
      </div>

      <!-- Área Operativa (Cuadrícula) -->
      <div class="org-grid" *ngIf="mostrarOperativo" >
        <div class="role-card" [class.highlight-card]="filtroActivo === 'produccion' || filtroActivo === 'administrativa'" *ngFor="let rol of equipoFiltrado">
          <div class="role-top">
            <div class="role-icon">{{ rol.icono }}</div>
            <div class="role-titles">
              <span class="level-pill">{{ rol.nivel }}</span>
              <h3>{{ rol.cargo }}</h3>
            </div>
          </div>
          <div class="responsable-box">
            <strong>Responsable:</strong> {{ rol.responsable }}
          </div>
          <p class="role-desc">
            {{ rol.funcion }}
          </p>
        </div>
      </div>
    </div>
    
  `,
  styles: [`
    :root {
      --bg-color: #FAF8F5;
      --card-bg: #FFFFFF;
      --primary-dark: #111E2E;
      --forest-green: #1B4332;
      --accent-terracotta: #C87D55;
      --accent-gold: #D4A373;
      --text-main: #2C3E50;
      --text-muted: #6C7A89;
      --border-color: #E2E8F0;
    }

    .wrap-org {
      max-width: 900px;
      margin: 0 auto;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      padding: 2rem 1rem;
      background-color: #FAF8F5;
      color: #2C3E50;
    }

    .org-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #FFFFFF;
      padding: 1.5rem 2rem;
      border-radius: 8px;
      border: 1px solid #E2E8F0;
      margin-bottom: 1.5rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.02);
    }

    .badge-sec {
      font-size: 0.75rem;
      font-weight: 700;
      color: #1B4332;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .org-header h2 {
      font-size: 1.25rem;
      color: #111E2E;
      margin-top: 0.2rem;
    }

    .badge-plan {
      font-size: 0.75rem;
      color: #6C7A89;
      text-transform: uppercase;
      font-weight: 600;
    }

    .interactive-bar {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
    }

    .filter-btn {
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
      color: #6C7A89;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .filter-btn:hover, .filter-btn.active {
      background: #1B4332;
      color: white;
      border-color: #1B4332;
    }

    .leader-card {
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-left: 4px solid #1B4332;
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      box-shadow: 0 2px 6px rgba(0,0,0,0.02);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .leader-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0,0,0,0.06);
    }

    .role-top {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .role-icon {
      font-size: 1.5rem;
      background: rgba(27, 67, 50, 0.08);
      width: 45px;
      height: 45px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 10px;
    }

    .level-pill {
      font-size: 0.7rem;
      text-transform: uppercase;
      color: #6C7A89;
      font-weight: 700;
      letter-spacing: 0.5px;
    }

    .role-titles h3 {
      font-size: 1.1rem;
      color: #111E2E;
    }

    .responsable-box {
      font-size: 0.9rem;
      color: #2C3E50;
      margin-bottom: 0.5rem;
      background: #F8FAFC;
      padding: 0.5rem 0.75rem;
      border-radius: 6px;
    }

    .role-desc {
      font-size: 0.85rem;
      color: #6C7A89;
      line-height: 1.5;
    }

    .org-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 1.5rem;
    }

    .role-card {
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.02);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .role-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0,0,0,0.06);
    }

    .highlight-card {
      border-color: #D4A373 !important;
      box-shadow: 0 0 10px rgba(212, 163, 115, 0.3);
    }
  `]
})
export class EstructuraOrganizacionalComponent {
  data = ESTRUCTURA_ORGANIZACIONAL_DATA;

  filtroActivo: string = 'todos';
  mostrarDireccion: boolean = true;
  mostrarOperativo: boolean = true;
  equipoFiltrado = [...this.data.equipoOperativo];

  filtrar(categoria: string) {
    this.filtroActivo = categoria;

    if (categoria === 'todos') {
      this.mostrarDireccion = true;
      this.mostrarOperativo = true;
      this.equipoFiltrado = [...this.data.equipoOperativo];
    } else if (categoria === 'direccion') {
      this.mostrarDireccion = true;
      this.mostrarOperativo = false;
    } else if (categoria === 'produccion') {
      this.mostrarDireccion = false;
      this.mostrarOperativo = true;
      this.equipoFiltrado = [this.data.equipoOperativo[0], this.data.equipoOperativo[1]];
    } else if (categoria === 'administrativa') {
      this.mostrarDireccion = false;
      this.mostrarOperativo = true;
      this.equipoFiltrado = [this.data.equipoOperativo[2]];
    }
  }
}
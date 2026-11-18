import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { INFORMACION_FINANCIERA_DATA } from '../data/informacion-financiera';

@Component({
  selector: 'app-informacion-financiera',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="section band" id="financiera">
      <div class="wrap-finance">
        
        <!-- ENCABEZADO DE SECCIÓN -->
        <div class="finance-header">
          <div>
            <span class="badge-sec">{{ data.seccion }}</span>
            <h2>{{ data.titulo }}</h2>
            <p class="subtitle">{{ data.subtitulo }}</p>
          </div>
          <span class="badge-plan">{{ data.puntoPlan }}</span>
        </div>

        <!-- BARRA INTERACTIVA DE VISTAS Y ESCENARIOS -->
        <div class="controls-bar">
          <div class="view-tabs">
            <button class="tab-btn" [class.active]="vistaActiva === 'todo'" (click)="vistaActiva = 'todo'">
              Vista Completa
            </button>
            <button class="tab-btn" [class.active]="vistaActiva === 'kpis'" (click)="vistaActiva = 'kpis'">
              Inversión y Capital
            </button>
            <button class="tab-btn" [class.active]="vistaActiva === 'proyecciones'" (click)="vistaActiva = 'proyecciones'">
              Proyección de Ventas y Costos
            </button>
          </div>

          <div class="scenario-box" *ngIf="vistaActiva !== 'kpis'">
            <span class="scenario-label">Simulador Año 1:</span>
            <button class="scen-btn" [class.active]="factorEscenario === 0.8" (click)="cambiarEscenario(0.8)">
              Conservador (80%)
            </button>
            <button class="scen-btn" [class.active]="factorEscenario === 1" (click)="cambiarEscenario(1)">
              Base (100%)
            </button>
            <button class="scen-btn" [class.active]="factorEscenario === 1.2" (click)="cambiarEscenario(1.2)">
              Optimista (120%)
            </button>
          </div>
        </div>

        <!-- TARJETAS SUPERIORES: INDICADORES PRINCIPALES (KPIs) -->
        <div class="kpi-grid" *ngIf="vistaActiva === 'todo' || vistaActiva === 'kpis'">
          <div 
            class="kpi-card" 
            *ngFor="let kpi of data.indicadores" 
            [class.kpi-highlight]="kpi.destacado"
            [class.kpi-selected]="kpiSeleccionado === kpi.id"
            (click)="toggleKpi(kpi.id)"
            title="Haz clic para ver desglose">
            <div class="kpi-top">
              <span class="kpi-label">{{ kpi.etiqueta }}</span>
              <span class="kpi-icon">{{ kpi.icono }}</span>
            </div>
            <div class="kpi-value">{{ kpi.valor }}</div>
            <p class="kpi-detail">{{ kpi.detalle }}</p>

            <!-- Desglose interactivo al hacer clic -->
            <div class="kpi-extra" *ngIf="kpiSeleccionado === kpi.id">
              <div class="extra-line" *ngFor="let linea of kpi.desgloseExtra">
                • {{ linea }}
              </div>
            </div>
            <span class="kpi-hint">{{ kpiSeleccionado === kpi.id ? 'Ocultar detalle ▲' : 'Ver detalle ▼' }}</span>
          </div>
        </div>

        <!-- PANEL INFERIOR EN DOS COLUMNAS -->
        <div class="details-grid" *ngIf="vistaActiva === 'todo' || vistaActiva === 'proyecciones'">
          
          <!-- COLUMNA IZQUIERDA: INGRESOS PROYECTADOS AÑO 1 -->
          <div class="panel-card">
            <div class="panel-header">
              <span class="panel-icon">📈</span>
              <div>
                <h3>Ingresos Proyectados (Escenario {{ factorEscenario * 100 }}%)</h3>
                <span class="panel-sub">Desglose dinámico por línea de producto y volumen estimado</span>
              </div>
            </div>

            <div class="income-list">
              <div class="income-item" *ngFor="let item of data.ingresosProyectados">
                <div class="income-info">
                  <span class="income-title">{{ item.producto }}</span>
                  <span class="income-vol">
                    {{ formatearNumero(item.librasBase * factorEscenario) }} libras ({{ item.unidadTexto }})
                  </span>
                </div>
                <div class="income-right">
                  <span class="income-amount">
                    {{ formatearMoneda(item.librasBase * item.precioLibra * factorEscenario) }}
                  </span>
                  <span class="income-pct">{{ item.porcentaje }}%</span>
                </div>
                <div class="progress-track">
                  <div class="progress-fill" [style.width.%]="item.porcentaje"></div>
                </div>
              </div>
            </div>

            <div class="summary-boxes">
              <div class="total-bar">
                <span>Total Ventas Proyectadas</span>
                <strong>{{ formatearMoneda(totalVentasCalculado) }}</strong>
              </div>
              <div class="margin-bar">
                <span>Margen Bruto Operativo (tras costos fijos y admin.)</span>
                <strong>{{ formatearMoneda(margenOperativoCalculado) }}</strong>
              </div>
            </div>
          </div>

          <!-- COLUMNA DERECHA: OTRAS CIFRAS REGISTRADAS E IMPACTO -->
          <div class="panel-card">
            <div class="panel-header">
              <span class="panel-icon">🧾</span>
              <div>
                <h3>Otras Cifras Registradas e Impacto</h3>
                <span class="panel-sub">Estructura operativa, volumen físico y alcance social</span>
              </div>
            </div>

            <div class="metrics-stack">
              <div class="metric-row" *ngFor="let metrica of data.otrasCifras">
                <div class="m-badge">{{ metrica.icono }}</div>
                <div class="m-content">
                  <div class="m-top">
                    <strong>{{ metrica.titulo }}</strong>
                    <span class="m-figure" [ngClass]="metrica.badgeClass">{{ metrica.cifra }}</span>
                  </div>
                  <p>{{ metrica.descripcion }}</p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  `,
  styles: [`
    .band {
      background: #fbf9f5;
      padding: 3rem 1rem;
      font-family: inherit;
    }
    .wrap-finance {
      max-width: 1200px;
      margin: 0 auto;
    }

    /* ENCABEZADO */
    .finance-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      background: #2c3e50;
      color: #ffffff;
      padding: 1.5rem 1.75rem;
      border-radius: 12px;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
      gap: 1rem;
      box-shadow: 0 6px 20px rgba(44, 62, 80, 0.12);
    }
    .badge-sec {
      display: inline-block;
      background: #d69e2e;
      color: #ffffff;
      font-size: 0.72rem;
      font-weight: 800;
      padding: 0.2rem 0.65rem;
      border-radius: 20px;
      letter-spacing: 0.6px;
      margin-bottom: 0.4rem;
    }
    .finance-header h2 {
      font-size: 1.35rem;
      font-weight: 800;
      margin: 0 0 0.35rem 0;
    }
    .subtitle {
      font-size: 0.9rem;
      color: #e2e8f0;
      margin: 0;
    }
    .badge-plan {
      background: rgba(255, 255, 255, 0.14);
      color: #f7fafc;
      border: 1px solid rgba(255, 255, 255, 0.25);
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.35rem 0.85rem;
      border-radius: 6px;
      text-transform: uppercase;
    }

    /* CONTROLES INTERACTIVOS */
    .controls-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 1.75rem;
      background: #ffffff;
      padding: 0.85rem 1.25rem;
      border-radius: 10px;
      border: 1px solid #e2e8f0;
    }
    .view-tabs, .scenario-box {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;
    }
    .scenario-label {
      font-size: 0.78rem;
      font-weight: 700;
      color: #4a5568;
      margin-right: 0.25rem;
    }
    .tab-btn, .scen-btn {
      background: #f8fafc;
      border: 1px solid #cbd5e0;
      color: #4a5568;
      padding: 0.4rem 0.85rem;
      border-radius: 20px;
      font-size: 0.78rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .tab-btn:hover, .scen-btn:hover {
      border-color: #2c3e50;
      color: #1a202c;
    }
    .tab-btn.active {
      background: #2c3e50;
      color: #ffffff;
      border-color: #2c3e50;
    }
    .scen-btn.active {
      background: #1B4332;
      color: #ffffff;
      border-color: #1B4332;
    }

    /* TARJETAS SUPERIORES (KPIs) */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.25rem;
      margin-bottom: 2rem;
    }
    @media (max-width: 1050px) {
      .kpi-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 600px) {
      .kpi-grid { grid-template-columns: 1fr; }
    }

    .kpi-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 1.25rem;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04);
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      cursor: pointer;
      transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
    }
    .kpi-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
      border-color: #cbd5e0;
    }
    .kpi-selected {
      border: 2px solid #d69e2e !important;
    }
    .kpi-highlight {
      background: linear-gradient(145deg, #1e3a2f, #2c3e50);
      color: #ffffff;
      border: none;
    }
    .kpi-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 0.5rem;
    }
    .kpi-label {
      font-size: 0.72rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      color: #718096;
      line-height: 1.3;
    }
    .kpi-highlight .kpi-label { color: #cbd5e0; }
    .kpi-icon { font-size: 1.25rem; flex-shrink: 0; }
    .kpi-value {
      font-size: 1.45rem;
      font-weight: 800;
      color: #1a202c;
      letter-spacing: -0.3px;
    }
    .kpi-highlight .kpi-value { color: #f6e05e; }
    .kpi-detail {
      font-size: 0.78rem;
      color: #4a5568;
      line-height: 1.45;
      margin: 0;
    }
    .kpi-highlight .kpi-detail { color: #e2e8f0; }

    .kpi-extra {
      margin-top: 0.4rem;
      padding-top: 0.5rem;
      border-top: 1px dashed rgba(160, 174, 192, 0.4);
      font-size: 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .kpi-hint {
      margin-top: auto;
      font-size: 0.7rem;
      font-weight: 700;
      opacity: 0.75;
      text-align: right;
    }

    /* PANEL INFERIOR 2 COLUMNAS */
    .details-grid {
      display: grid;
      grid-template-columns: 1.05fr 0.95fr;
      gap: 1.75rem;
    }
    @media (max-width: 920px) {
      .details-grid { grid-template-columns: 1fr; }
    }

    .panel-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      padding: 1.5rem;
      box-shadow: 0 4px 18px rgba(0, 0, 0, 0.05);
      display: flex;
      flex-direction: column;
    }
    .panel-header {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #edf2f7;
      margin-bottom: 1.25rem;
    }
    .panel-icon {
      width: 42px;
      height: 42px;
      border-radius: 10px;
      background: #edf2f7;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.3rem;
      flex-shrink: 0;
    }
    .panel-header h3 {
      font-size: 1.08rem;
      font-weight: 800;
      color: #1a202c;
      margin: 0 0 0.15rem 0;
    }
    .panel-sub {
      font-size: 0.8rem;
      color: #718096;
    }

    /* LISTA DE INGRESOS CON BARRAS */
    .income-list {
      display: flex;
      flex-direction: column;
      gap: 1.2rem;
      margin-bottom: 1.5rem;
    }
    .income-item {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 0.4rem 1rem;
      align-items: center;
    }
    .income-title {
      display: block;
      font-size: 0.88rem;
      font-weight: 700;
      color: #2d3748;
      margin-bottom: 0.15rem;
    }
    .income-vol {
      display: block;
      font-size: 0.78rem;
      color: #718096;
    }
    .income-right { text-align: right; }
    .income-amount {
      display: block;
      font-size: 0.95rem;
      font-weight: 800;
      color: #1a202c;
    }
    .income-pct {
      display: inline-block;
      font-size: 0.72rem;
      font-weight: 700;
      color: #276749;
      background: #def7ec;
      padding: 0.05rem 0.45rem;
      border-radius: 10px;
    }
    .progress-track {
      grid-column: 1 / -1;
      height: 8px;
      background: #edf2f7;
      border-radius: 99px;
      overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #2c3e50, #38a169);
      border-radius: 99px;
      transition: width 0.3s ease;
    }

    .summary-boxes {
      margin-top: auto;
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
    }
    .total-bar, .margin-bar {
      background: #f8fafc;
      border: 1px solid #cbd5e0;
      border-radius: 10px;
      padding: 0.8rem 1.1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.9rem;
      color: #2d3748;
    }
    .total-bar strong {
      font-size: 1.12rem;
      font-weight: 800;
      color: #276749;
    }
    .margin-bar {
      background: #f0fff4;
      border-color: #9ae6b4;
    }
    .margin-bar strong {
      font-size: 1rem;
      font-weight: 800;
      color: #1B4332;
    }

    /* OTRAS CIFRAS REGISTRADAS */
    .metrics-stack {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .metric-row {
      display: flex;
      align-items: flex-start;
      gap: 0.85rem;
      padding: 0.85rem;
      background: #fafbfc;
      border: 1px solid #edf2f7;
      border-radius: 10px;
      transition: transform 0.2s ease;
    }
    .metric-row:hover {
      transform: translateX(3px);
      border-color: #cbd5e0;
    }
    .m-badge {
      font-size: 1.25rem;
      flex-shrink: 0;
      margin-top: 0.1rem;
    }
    .m-content { flex-grow: 1; }
    .m-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.4rem;
      margin-bottom: 0.3rem;
    }
    .m-top strong {
      font-size: 0.88rem;
      color: #1a202c;
    }
    .m-figure {
      font-size: 0.85rem;
      font-weight: 800;
      color: #2c3e50;
      background: #edf2f7;
      padding: 0.15rem 0.55rem;
      border-radius: 6px;
    }
    .green-tag { background: #def7ec; color: #03543f; }
    .gold-tag { background: #fefcbf; color: #744210; }
    .m-content p {
      font-size: 0.82rem;
      color: #4a5568;
      line-height: 1.45;
      margin: 0;
    }
  `]
})
export class InformacionFinancieraComponent {
  data = INFORMACION_FINANCIERA_DATA;

  vistaActiva: 'todo' | 'kpis' | 'proyecciones' = 'todo';
  factorEscenario: number = 1;
  kpiSeleccionado: string | null = null;

  cambiarEscenario(factor: number) {
    this.factorEscenario = factor;
  }

  toggleKpi(id: string) {
    this.kpiSeleccionado = this.kpiSeleccionado === id ? null : id;
  }

  get totalVentasCalculado(): number {
    return this.data.ingresosProyectados.reduce(
      (acc, item) => acc + item.librasBase * item.precioLibra * this.factorEscenario,
      0
    );
  }

  get margenOperativoCalculado(): number {
    return this.totalVentasCalculado - (this.data.costosFijosValor + this.data.gastosAdminValor);
  }

  formatearMoneda(valor: number): string {
    return '$' + Math.round(valor).toLocaleString('es-CO');
  }

  formatearNumero(valor: number): string {
    return Math.round(valor).toLocaleString('es-CO');
  }
}
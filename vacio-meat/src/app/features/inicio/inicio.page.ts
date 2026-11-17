
import { Component } from '@angular/core';

import { HeroComponent } from './components/hero/hero.component';
import { ProductosGridComponent } from '../productos/components/productos-grid/productos-grid.component';
import { BeneficiosComponent } from '../proceso/components/beneficios/beneficios.component';
import { FichaProductoComponent } from '../productos/components/ficha-producto/ficha-producto.component';
import { FichaUnidadComponent } from '../proyecto/components/ficha-unidad/ficha-unidad.component';
import { EncuestaValidacionComponent } from '../encuesta-validacion/components/encuesta-validacion.component';
import { MercadoObjetivoComponent } from '../mercado-objetivo/components/mercado-objetivo.component';
import { FichaComercializacionComponent } from '../comercializacion/components/ficha-comercializacion/ficha-comercializacion.component';
import { CompetenciaComponent } from '../competencia/components/competencia.component';
//import { EstructuraOrganizacionalComponent } from '../estructura/components/estructura-organizacional.component';
import { EstructuraOrganizacionalComponent } from '../estructura-organizacional/components/estructura-organizacional.component';
import { InformacionFinancieraComponent } from '../informacion-financiera/components/informacion-financiera.component';
import { LeanCanvasComponent } from '../lean-canvas/components/lean-canvas.component';
import { CadenaValorComponent } from '../cadena-valor/components/cadena-valor.component';
@Component({
  selector: 'app-inicio-page',
  standalone: true,
  imports: [
    HeroComponent,
    ProductosGridComponent,
    BeneficiosComponent,
    FichaProductoComponent,
    FichaUnidadComponent,
    FichaComercializacionComponent,
    EncuestaValidacionComponent,
    MercadoObjetivoComponent,
    CompetenciaComponent,
    CompetenciaComponent,
    EstructuraOrganizacionalComponent,
    InformacionFinancieraComponent,
    LeanCanvasComponent,
    CadenaValorComponent
  ],
  template: `
    <app-hero />
    <app-productos-grid />
    <app-beneficios />
    <app-ficha-producto />
    <app-ficha-unidad />
    <app-ficha-comercializacion />
    <app-encuesta-validacion />
    <app-mercado-objetivo />
    <app-competencia />
    <app-estructura-organizacional/>
    <app-informacion-financiera/>
    <app-lean-canvas/>
    <app-cadena-valor/>
  `,
})
export class InicioPage { }
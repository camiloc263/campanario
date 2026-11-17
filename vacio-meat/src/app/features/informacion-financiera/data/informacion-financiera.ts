export interface IndicadorFinanciero {
    id: string;
    etiqueta: string;
    valor: string;
    detalle: string;
    desgloseExtra: string[];
    icono: string;
    destacado?: boolean;
}

export interface LineaIngreso {
    producto: string;
    librasBase: number;
    precioLibra: number;
    unidadTexto: string;
    porcentaje: number;
}

export interface MetricaOperativa {
    titulo: string;
    cifra: string;
    descripcion: string;
    icono: string;
    badgeClass?: string;
}

export const INFORMACION_FINANCIERA_DATA = {
    seccion: 'SECCIÓN FINANCIERA',
    puntoPlan: 'PUNTO 12 DEL FORMATO DEL PLAN DE NEGOCIOS',
    titulo: 'Información Financiera y Recursos Requeridos',
    subtitulo: 'Estructura de inversión, proyección de ingresos y sostenibilidad económica — Granja Porcícola El Campanario',
    costosFijosValor: 14400000,
    gastosAdminValor: 6800000,
    indicadores: [
        {
            id: 'kpi-fondo',
            etiqueta: 'Solicitud a Fondo Emprender',
            valor: '$98.500.000',
            detalle: 'Monto total solicitado para puesta en marcha (ajustable según presupuesto en Excel).',
            desgloseExtra: [
                '55.0% destinado a activos fijos y adecuación.',
                '45.0% destinado a capital de trabajo y preoperativos.'
            ],
            icono: '🏛️',
            destacado: true
        },
        {
            id: 'kpi-fija',
            etiqueta: 'Inversión Fija Registrada',
            valor: '$54.200.000',
            detalle: 'Adecuación de cocheras bioseguras, zona de compostaje, empacadora al vacío industrial, cuarto frío/congeladores, báscula ganadera y equipo POS.',
            desgloseExtra: [
                'Infraestructura biosegura y compostaje.',
                'Maquinaria de empaque al vacío y cadena de frío.'
            ],
            icono: '🏗️'
        },
        {
            id: 'kpi-capital',
            etiqueta: 'Preoperativos y Capital de Trabajo',
            valor: '$44.300.000',
            detalle: 'Semovientes/pie de cría, alimento balanceado inicial, insumos de bioseguridad, bolsas de vacío y trámites sanitarios ICA.',
            desgloseExtra: [
                'Adquisición de pie de cría y alimentación inicial.',
                'Insumos de empaque y registros sanitarios ICA.'
            ],
            icono: '🐖'
        },
        {
            id: 'kpi-ventas',
            etiqueta: 'Ventas Proyectadas Año 1',
            valor: '$86.400.000',
            detalle: 'Proyección comercial anual sobre 7.500 libras en cortes empacados al vacío y carne en canal.',
            desgloseExtra: [
                '79.2% proveniente de cortes empacados al vacío.',
                '20.8% proveniente de venta en canal al por mayor.'
            ],
            icono: '💰'
        }
    ] as IndicadorFinanciero[],
    ingresosProyectados: [
        {
            producto: 'Cortes magros empacados al vacío (Lomo, pierna y pulpa)',
            librasBase: 3500,
            precioLibra: 12000,
            unidadTexto: 'a $12.000/lb promedio',
            porcentaje: 48.6
        },
        {
            producto: 'Cortes especiales empacados al vacío (Costilla, chuleta y tocino carnudo)',
            librasBase: 2200,
            precioLibra: 12000,
            unidadTexto: 'a $12.000/lb promedio',
            porcentaje: 30.6
        },
        {
            producto: 'Carne en canal al por mayor (Carnicerías y restaurantes aliados)',
            librasBase: 1800,
            precioLibra: 10000,
            unidadTexto: 'en canal al por mayor',
            porcentaje: 20.8
        }
    ] as LineaIngreso[],
    otrasCifras: [
        {
            titulo: 'Costos fijos Año 1',
            cifra: '$14.400.000',
            descripcion: 'Servicios públicos, mantenimiento de cocheras, desinfección, transporte y dotaciones.',
            icono: '🏭'
        },
        {
            titulo: 'Gastos de administración y ventas',
            cifra: '$6.800.000',
            descripcion: 'Gestión contable, comercialización y logística local.',
            icono: '💼'
        },
        {
            titulo: 'Volumen total proyectado Año 1',
            cifra: '7.500 lb + 100% Compostaje',
            descripcion: '7.500 libras de carne porcina comercializada + aprovechamiento del 100 % de residuos en compostaje.',
            icono: '♻️',
            badgeClass: 'green-tag'
        },
        {
            titulo: 'Impacto laboral y comercial',
            cifra: '5 a 7 Empleos',
            descripcion: '5 a 7 empleos directos e indirectos, 20 familias vinculadas y 8 jornadas de promoción en mercados campesinos.',
            icono: '🤝',
            badgeClass: 'gold-tag'
        }
    ] as MetricaOperativa[]
};
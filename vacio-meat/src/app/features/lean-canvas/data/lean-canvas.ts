export type Categoria = 'mercado' | 'operacion' | 'finanzas';

export type IconoCanvas =
    | 'alerta' | 'idea' | 'metricas' | 'valor' | 'escudo' | 'canales'
    | 'clientes' | 'costos' | 'tendencia' | 'paquete' | 'casa' | 'calendario';

export interface BloqueCanvas {
    id: string;
    numero: number;
    titulo: string;
    categoria: Categoria;
    icono: IconoCanvas;
    items: string[];
    destacado?: boolean;
}

export const LEAN_CANVAS_DATA = {
    titulo: 'Lean Canvas del emprendimiento',
    subtitulo: 'Modelo de negocio resumido en sus componentes',
    marca: 'Granja Porcícola El Campanario',
    eslogan: 'Sabor y Tradición • Linares, Nariño',
};

export const CATEGORIAS: { id: Categoria; etiqueta: string; color: string }[] = [
    { id: 'mercado', etiqueta: 'Mercado y valor', color: 'var(--brand)' },
    { id: 'operacion', etiqueta: 'Operación y ventaja', color: '#1b7f4b' },
    { id: 'finanzas', etiqueta: 'Costos e ingresos', color: 'var(--wood)' },
];

/** Bloques en el orden clásico del Lean Canvas (1 al 9). */
export const BLOQUES: BloqueCanvas[] = [
    {
        id: 'problema',
        numero: 1,
        titulo: 'Problema',
        categoria: 'mercado',
        icono: 'alerta',
        items: [
            'Comercialización tradicional de carne de cerdo a granel sin empaque hermético, lo que reduce su vida útil en refrigeración y aumenta el riesgo de contaminación cruzada.',
            'Alta dependencia de intermediarios en plazas de mercado locales y falta de trazabilidad sanitaria clara desde la granja.',
            'Ingreso de carne porcina desde municipios vecinos con mayores sobrecostos de transporte y menor frescura para los hogares y comercios de Linares.',
        ],
    },
    {
        id: 'solucion',
        numero: 2,
        titulo: 'Solución',
        categoria: 'operacion',
        icono: 'idea',
        items: [
            'Producción tecnificada bajo Buenas Prácticas Porcícolas (BPP) en cocheras bioseguras.',
            'Desposte higiénico, porcionado y empacado al vacío industrial para garantizar frescura, inocuidad y mayor vida útil sin conservantes.',
            'Modelo de economía circular mediante el aprovechamiento del 100 % de residuos orgánicos para compostaje.',
        ],
    },
    {
        id: 'propuesta',
        numero: 3,
        titulo: 'Propuesta de valor',
        categoria: 'mercado',
        icono: 'valor',
        destacado: true,
        items: [
            'Carne de cerdo fresca, magra y de alta calidad producida localmente en Linares, Nariño.',
            'Tecnología de empacado al vacío que conserva intactas las propiedades organolépticas, garantiza máxima higiene y facilita el almacenamiento.',
            'Abastecimiento directo desde la granja sin intermediarios, a precios competitivos y con respaldo de producción limpia y sostenible.',
        ],
    },
    {
        id: 'segmento',
        numero: 4,
        titulo: 'Segmento de clientes',
        categoria: 'mercado',
        icono: 'clientes',
        items: [
            'Hogares y familias de Linares (18 a 65 años) que buscan carne porcina higiénica, fresca y lista para refrigerar.',
            'Establecimientos gastronómicos (restaurantes, asaderos y cafeterías) que requieren cortes estandarizados y suministro constante.',
            'Expendios cárnicos, tiendas de barrio y supermercados locales interesados en carne en canal y cortes porcionados al vacío.',
        ],
    },
    {
        id: 'canales',
        numero: 5,
        titulo: 'Canales',
        categoria: 'mercado',
        icono: 'canales',
        items: [
            'Punto de venta directo en granja y despacho con cadena de frío.',
            'Venta directa B2B a carnicerías, restaurantes y tiendas locales de Linares.',
            'Entregas programadas a domicilio para hogares.',
            'Participación en 8 jornadas de mercados campesinos y ferias agropecuarias.',
            'Pedidos digitales mediante WhatsApp Business y redes sociales.',
        ],
    },
    {
        id: 'ingresos',
        numero: 6,
        titulo: 'Flujo de ingresos',
        categoria: 'finanzas',
        icono: 'tendencia',
        items: [
            'Cortes magros al vacío (lomo, pierna, pulpa): 3.500 lb a $12.000/lb promedio = $42.000.000 (48,6 %).',
            'Cortes especiales al vacío (costilla, chuleta, tocino carnudo): 2.200 lb a $12.000/lb promedio = $26.400.000 (30,6 %).',
            'Carne en canal al por mayor (15 canales / 1.800 lb): $18.000.000 (20,8 %).',
            'Total ventas proyectadas Año 1: $86.400.000.',
        ],
    },
    {
        id: 'costos',
        numero: 7,
        titulo: 'Estructura de costos',
        categoria: 'finanzas',
        icono: 'costos',
        items: [
            'Inversión Fija: $54.200.000 (cocheras bioseguras, compostaje, empacadora al vacío, cuarto frío, báscula y POS).',
            'Preoperativos y Capital de Trabajo: $44.300.000 (pie de cría, alimento balanceado, bolsas de vacío, bioseguridad y registros ICA).',
            'Costos fijos Año 1: $14.400.000 (servicios, mantenimiento, desinfección, transporte y dotaciones).',
            'Gastos de administración y ventas Año 1: $6.800.000. Monto solicitado al Fondo Emprender: $98.500.000.',
        ],
    },
    {
        id: 'metricas',
        numero: 8,
        titulo: 'Métricas clave',
        categoria: 'operacion',
        icono: 'metricas',
        items: [
            'Volumen proyectado Año 1: 7.500 libras de carne porcina comercializada.',
            'Ventas proyectadas Año 1: $86.400.000.',
            'Aprovechamiento ambiental: 100 % de residuos transformados en compostaje.',
            'Impacto social: 5 a 7 empleos directos/indirectos y 20 familias vinculadas.',
            'Promoción comercial: 8 jornadas en mercados campesinos.',
        ],
    },
    {
        id: 'ventaja',
        numero: 9,
        titulo: 'Ventaja especial',
        categoria: 'operacion',
        icono: 'escudo',
        items: [
            'Única iniciativa local con empacado al vacío industrial y trazabilidad sanitaria completa en granja.',
            'Economía circular integrada (cero vertimientos mediante compostaje orgánico).',
            'Cadena corta de comercialización directa liderada por Jhonjan Portilla y red asociativa local.',
        ],
    },
];

/** Cifras destacadas (se animan al entrar en pantalla). */
export interface Kpi {
    rotulo: string;
    icono: IconoCanvas;
    valor?: number;
    prefijo?: string;
    sufijo?: string;
    texto?: string;        // si se define, se muestra tal cual (sin animar)
}

export const KPIS: Kpi[] = [
    { rotulo: 'Ventas proyectadas · Año 1', icono: 'tendencia', valor: 86400000, prefijo: '$' },
    { rotulo: 'Volumen proyectado · Año 1', icono: 'paquete', valor: 7500, sufijo: ' lb' },
    { rotulo: 'Monto solicitado al Fondo Emprender', icono: 'costos', valor: 98500000, prefijo: '$' },
    { rotulo: 'Empleos directos e indirectos', icono: 'clientes', texto: '5 a 7' },
    { rotulo: 'Familias vinculadas', icono: 'casa', valor: 20 },
    { rotulo: 'Jornadas en mercados campesinos', icono: 'calendario', valor: 8 },
];

/** Gráficos de barras que se muestran dentro de la ventana de detalle. */
export interface FilaGrafico { rotulo: string; valor: number; detalle?: string; }
export interface GrupoGrafico {
    titulo: string;
    filas: FilaGrafico[];
    total?: number;
    totalRotulo?: string;
}

export const GRAFICOS: Record<string, GrupoGrafico[]> = {
    ingresos: [
        {
            titulo: 'Participación en las ventas proyectadas del Año 1',
            filas: [
                { rotulo: 'Cortes magros al vacío', valor: 42000000, detalle: '3.500 lb · 48,6 %' },
                { rotulo: 'Cortes especiales al vacío', valor: 26400000, detalle: '2.200 lb · 30,6 %' },
                { rotulo: 'Carne en canal al por mayor', valor: 18000000, detalle: '15 canales / 1.800 lb · 20,8 %' },
            ],
            total: 86400000,
            totalRotulo: 'Total ventas proyectadas Año 1',
        },
    ],
    costos: [
        {
            titulo: 'Inversión inicial',
            filas: [
                {
                    rotulo: 'Inversión fija',
                    valor: 54200000,
                    detalle: 'Cocheras bioseguras, compostaje, empacadora al vacío, cuarto frío, báscula y POS',
                },
                {
                    rotulo: 'Preoperativos y capital de trabajo',
                    valor: 44300000,
                    detalle: 'Pie de cría, alimento balanceado, bolsas de vacío, bioseguridad y registros ICA',
                },
            ],
            total: 98500000,
            totalRotulo: 'Monto solicitado al Fondo Emprender',
        },
        {
            titulo: 'Operación · Año 1',
            filas: [
                {
                    rotulo: 'Costos fijos',
                    valor: 14400000,
                    detalle: 'Servicios, mantenimiento, desinfección, transporte y dotaciones',
                },
                { rotulo: 'Gastos de administración y ventas', valor: 6800000 },
            ],
        },
    ],
};

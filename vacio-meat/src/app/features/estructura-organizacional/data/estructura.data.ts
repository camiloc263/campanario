export type IconoRol = 'gerencia' | 'pecuario' | 'empaque' | 'contable';

export interface RolEquipo {
  id: string;
  cargo: string;
  nivel: string;
  responsable: string;
  funcion: string;
  responsabilidades: string[];   // la función dividida en puntos (se ve en "Ver detalle")
  icono: IconoRol;
  acento: string;                // color del rol (variable CSS del sitio)
}

export const CABECERA = {
  titulo: 'Estructura organizacional y equipo de trabajo',
  subtitulo: 'Organización prevista para la operación integral de Granja Porcícola El Campanario',
  nota: 'Punto 7 del plan de negocios',      // deja '' para ocultar la etiqueta
};

/** Nodo principal del organigrama. */
export const GERENCIA: RolEquipo = {
  id: 'gerencia',
  cargo: 'Administración / Gerencia',
  nivel: 'Dirección estratégica',
  responsable: 'Orlando Cuaran',
  funcion:
    'Planeación estratégica, coordinación general del negocio, gestión comercial y representación asociativa.',
  responsabilidades: [
    'Planeación estratégica',
    'Coordinación general del negocio',
    'Gestión comercial',
    'Representación asociativa',
  ],
  icono: 'gerencia',
  acento: 'var(--brand)',
};

/** Áreas operativas y de soporte (segundo nivel). */
export const EQUIPO: RolEquipo[] = [
  {
    id: 'pecuario',
    cargo: 'Operador pecuario y bioseguridad',
    nivel: 'Área de producción',
    responsable: 'Personal técnico / asociado de la granja',
    funcion:
      'Manejo de cocheras, alimentación balanceada, control de Buenas Prácticas Pecuarias (BPP) y gestión del sistema de economía circular (compostaje).',
    responsabilidades: [
      'Manejo de cocheras',
      'Alimentación balanceada',
      'Control de Buenas Prácticas Pecuarias (BPP)',
      'Gestión del sistema de economía circular (compostaje)',
    ],
    icono: 'pecuario',
    acento: '#1b7f4b',
  },
  {
    id: 'empaque',
    cargo: 'Auxiliar de proceso, empacado y logística',
    nivel: 'Planta y distribución',
    responsable: 'Personal de apoyo asociativo',
    funcion:
      'Desposte higiénico, porcionado, operación de la máquina de empacado al vacío, control de cadena de frío y atención de pedidos.',
    responsabilidades: [
      'Desposte higiénico',
      'Porcionado',
      'Operación de la máquina de empacado al vacío',
      'Control de cadena de frío',
      'Atención de pedidos',
    ],
    icono: 'empaque',
    acento: 'var(--wood)',
  },
  {
    id: 'contable',
    cargo: 'Contador / apoyo contable',
    nivel: 'Gestión administrativa',
    responsable: 'Profesional externo / asesoría contable',
    funcion:
      'Registro formal de ingresos, gastos, costos de producción, cumplimiento de obligaciones tributarias y gestión administrativa.',
    responsabilidades: [
      'Registro formal de ingresos, gastos y costos de producción',
      'Cumplimiento de obligaciones tributarias',
      'Gestión administrativa',
    ],
    icono: 'contable',
    acento: '#4a4a46',
  },
];

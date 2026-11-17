export interface RolEquipo {
    cargo: string;
    nivel: string;
    responsable: string;
    funcion: string;
    icono: string;
}

export const ESTRUCTURA_ORGANIZACIONAL_DATA = {
    seccion: "Sección 7",
    puntoPlan: "Punto 7 del Plan de Negocios",
    titulo: "Estructura Organizacional y Equipo de Trabajo",
    gerencia: {
        cargo: 'Administración / Gerencia',
        nivel: 'Dirección Estratégica',
        responsable: 'Orlando Cuaran',
        funcion: 'Planeación estratégica, coordinación general del negocio, gestión comercial y representación asociativa.',
        icono: '👔'
    } as RolEquipo,
    equipoOperativo: [
        {
            cargo: 'Operador Pecuario y Bioseguridad',
            nivel: 'Área de Producción',
            responsable: 'Personal técnico / asociado',
            funcion: 'Manejo de cocheras, alimentación balanceada, control de BPP y gestión del sistema de economía circular.',
            icono: '🐖'
        },
        {
            cargo: 'Auxiliar de Proceso y Empacado',
            nivel: 'Planta y Distribución',
            responsable: 'Personal de apoyo asociativo',
            funcion: 'Desposte higiénico, porcionado, operación de empaque al vacío, cadena de frío y entrega de pedidos.',
            icono: '🥩'
        },
        {
            cargo: 'Apoyo Contable',
            nivel: 'Gestión Administrativa',
            responsable: 'Profesional externo / asesor',
            funcion: 'Registro de ingresos, costos de producción, obligaciones tributarias y gestión administrativa.',
            icono: '📊'
        }
    ] as RolEquipo[]
};
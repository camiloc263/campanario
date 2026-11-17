export interface Diapositiva {
    id: string;
    src: string;        // ruta dentro de public/ (si no existe, se omite esa diapositiva)
    alt: string;
    leyenda: string;
}

export const DIAPOSITIVAS: Diapositiva[] = [
    {
        id: 'productos',
        src: 'images/hero/hero.jpg',
        alt: 'Cortes de cerdo empacados al vacío sobre una tabla de madera',
        leyenda: 'Cortes empacados al vacío',
    },
    {
        id: 'paisaje',
        src: 'images/historia/paisaje-linares.png',
        alt: 'Paisaje rural de Linares, Nariño',
        leyenda: 'Paisaje rural de Linares',
    },
    {
        id: 'equipo',
        src: 'images/historia/nosotros.jpg',
        alt: 'Carniceros de Linares cortando carne de cerdo en el taller',
        leyenda: 'Desposte higiénico en el taller',
    },
];

export const HERO = {
    pre: 'Granja porcícola',
    marca: 'El Campanario',
    unidad: 'Unidad productiva porcícola',
    ubicacion: 'Linares, Nariño',
    texto:
        'Una propuesta para producir y comercializar carne de cerdo fresca, magra y de alta calidad (cortes especiales y en canal), bajo estrictos estándares de bioseguridad y economía circular para la región.',
    rasgos: ['Carne fresca y magra', 'Cortes especiales y en canal', 'Bioseguridad', 'Economía circular'],
    botonPrincipal: 'Ver nuestros productos',
    botonSecundario: 'Pedir por WhatsApp',
    mensajeWhatsapp: 'Hola, quiero información sobre la Granja Porcícola El Campanario.',
    familias: 20,
    sello: { titulo: 'Empacado al vacío', texto: 'Sin conservantes artificiales' },
};

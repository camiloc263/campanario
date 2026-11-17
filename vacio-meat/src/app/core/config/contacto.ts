export const CONTACTO = {
  telefono: '+57 300 000 0000',
  whatsapp: '573000000000',
  email: 'email@vaciomeat.com',
  direccion: 'Cl 5 #44-20, Linares, Nariño',
};

export const MAPA_URL =
  'https://maps.google.com/maps?q=Linares,%20Nari%C3%B1o,%20Colombia&z=14&output=embed';

export const urlWhatsapp = (mensaje: string): string =>
  `https://wa.me/${CONTACTO.whatsapp}?text=${encodeURIComponent(mensaje)}`;

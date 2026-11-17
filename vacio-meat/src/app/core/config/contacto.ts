export const CONTACTO = {
  telefono: '+57 3183117313',
  whatsapp: '573183117313',
  email: 'email@vaciomeat.com',
  direccion: 'Cl 5 #44-20, Linares, Nariño',
};

export const MAPA_URL =
  'https://maps.google.com/maps?q=Linares,%20Nari%C3%B1o,%20Colombia&z=14&output=embed';

export const urlWhatsapp = (mensaje: string): string =>
  `https://wa.me/${CONTACTO.whatsapp}?text=${encodeURIComponent(mensaje)}`;

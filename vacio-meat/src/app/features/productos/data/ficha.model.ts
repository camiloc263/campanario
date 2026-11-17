export type CategoriaFicha = 'producto' | 'servicio' | 'innovacion' | 'equipos';
export type IconoFicha = 'vacio' | 'parrilla' | 'camion' | 'hoja' | 'equipos';

export interface FichaItem {
  id: string;
  categoria: CategoriaFicha;
  etiqueta: string;          // texto de la insignia (Producto, Servicio…)
  icono: IconoFicha;         // se muestra si no hay imagen
  imagen?: string;           // ruta opcional en public/ (si falla al cargar, se usa el ícono)
  titulo: string;
  resumen: string;           // texto corto para la tarjeta
  texto: string;             // texto completo (se ve en "Ver detalle")
  etiquetas: string[];       // chips cortos
  lista?: string[];          // ventajas o equipos
  tituloLista?: string;
  cotizable: boolean;        // muestra el botón de WhatsApp
}
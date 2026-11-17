# VACÍO MEAT co. – sitio informativo (Angular, standalone + Router)

## Puesta en marcha
```bash
npm i -g @angular/cli
ng new vacio-meat --style=css --ssr=false --routing=false
cd vacio-meat
# Reemplaza src/ y copia public/images/ del zip
ng serve
```

## Estructura
- `src/styles/` tokens (variables), base (reset, .btn, .section) y utilities.
- `src/app/core/` layout (header, footer) y configuración (contacto, navegación).
- `src/app/shared/` modelos y componentes de UI reutilizables (`app-boton`, `app-titulo-seccion`).
- `src/app/features/<página>/` cada página con sus componentes y datos.
  `inicio` reutiliza `productos-grid` (productos) y `beneficios` (proceso).

## Rutas
`/` · `/productos` · `/proceso` · `/historia` · `/contacto` · `**` (no encontrada). Carga lazy y título por página.

## Imágenes (public/images/)
- `brand/logo.svg` (marcador: reemplázalo por el logo real)
- `hero/hero.jpg`
- `productos/producto-chuletas.jpg`, `producto-panceta.jpg`, `producto-lomo.jpg`
- `historia/nosotros.jpg`

## Contenido editable
- Contacto y WhatsApp: `src/app/core/config/contacto.ts`
- Menú: `src/app/core/config/navegacion.ts`
- Productos: `src/app/features/productos/data/productos.data.ts`
- Beneficios: `src/app/features/proceso/data/beneficios.data.ts`

## Despliegue
SPA: redirige todas las rutas a `index.html` (Firebase `rewrites`; Nginx `try_files $uri /index.html`; Netlify `/* /index.html 200`).

# ARUTAM — Web

Sitio estático (HTML + CSS + JavaScript), sin dependencias. Bilingüe ES/EN y adaptado a móvil.

## Cómo abrirlo en Visual Studio Code
1. Descomprime la carpeta y ábrela con **Archivo → Abrir carpeta**.
2. Instala la extensión **Live Server** (Ritwick Dey).
3. Clic derecho en `index.html` → **Open with Live Server**.

## Estructura
- `index.html` — todas las secciones: Inicio, Nosotros, Origen, Productos, Ficha de producto, Contacto.
- `css/styles.css` — colores y tipografías del manual de marca (variables al inicio).
- `js/i18n.js` — **todos los textos en español e inglés**. Para cambiar un texto, edita su clave aquí.
- `js/main.js` — idioma, fichas de producto, transición, hojas con movimiento, cursor, menú móvil, formulario.
- `img/` y `fonts/` — logo, foto de fondo y tipografías.

## Imágenes
Ya incluidas: botellas recortadas (`img/botella-*.png`), fotos de las puertas (`img/door-*.jpg`) y de Nosotros (`img/foto-selva.jpg`, `img/foto-ritual.jpg`). En `img/extra/` hay dos fotos más sin usar.
Para cambiar una, sustituye el archivo conservando el nombre.

Pendientes (opcionales; si faltan, se ve el arco con su degradado):
- `img/cocktail-aya-1.jpg` … `cocktail-aya-3.jpg`; igual con `gua` y `cac` (9 fotos de cócteles).
- Para una portada más nítida, sustituye `img/selva-fondo.jpg` por una foto de al menos 2000 px de ancho.
- Los recortes de botella son automáticos; conviene revisarlos de cerca o rehacerlos con las fotos de estudio.

## Para cambiar
- **Datos de producto** (graduación, volumen): añádelos en `PRODUCTS` de `js/main.js` y en `renderFicha()`.
- **Formulario:** ahora abre el correo de quien lo envía. Para envío real usa un servicio como Formspree o Netlify Forms.
- **Publicar:** sirve en Netlify, Vercel o GitHub Pages arrastrando la carpeta.

## Tipografías
- Tan Spring (titulares) y Town 10 Display (menú, botones y etiquetas): siguen el manual de marca. Town 10 solo tiene mayúsculas, por eso los párrafos usan **Jost** (licencia libre OFL).
- Los archivos de Town 10 Display indican "gratuita para uso personal". Para una web comercial, confirma la licencia.

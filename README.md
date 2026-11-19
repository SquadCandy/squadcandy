# Plantilla de tienda online para emprendimientos (5.° de secundaria)

Esta plantilla es una **tienda online básica**: el cliente ve el catálogo, añade productos al **carrito**,
revisa su compra, completa el **checkout** (datos de contacto, entrega y método de pago: **efectivo** o **Yape / Plin**)
y envía su pedido por **WhatsApp**. **No hay pasarela de pago ni cobro real.**

**No necesitas programar:** solo cambias 2 archivos de texto y subes tus imágenes.

> 🔒 Tu tienda será **pública en internet**. Usa **datos ficticios** o los que te indique tu docente.
> **No publiques** tu número personal, tu número de Yape/Plin real, códigos QR de cobro reales ni tu dirección.

## Cómo funciona (para entenderlo bien)

- El **carrito se guarda en el navegador** de quien compra. No hay base de datos ni servidor.
- El **pedido llega a la tienda por WhatsApp**: al confirmar, se abre el chat con el mensaje ya escrito (productos, total, datos del cliente y forma de pago).
- En una tienda real, un equipo de programación agregaría un servidor para guardar pedidos y verificar pagos. Aquí diseñas y pruebas **la experiencia de compra completa**.

## Qué vas a cambiar

| Archivo o carpeta | Qué contiene |
|---|---|
| `src/data/marca.json` | Nombre, colores, fuentes, textos, contacto, **entrega y métodos de pago** |
| `src/data/productos.json` | Tus productos: id, nombre, descripción, precio e imagen |
| `public/logo.svg` (o `.png`) | Tu logo |
| `public/productos/` | Fotos de tus productos (y, si tu docente lo permite, un QR de ejemplo) |

No cambies nada más.

## Paso 1. Crea tu copia

1. Entra a la dirección de la plantilla que te dio tu docente.
2. Pulsa **Use this template** (*Usar esta plantilla*) → **Create a new repository**.
3. Ponle un nombre sin espacios ni tildes (ejemplo: `mi-tienda`) y elige **Public**.
4. Pulsa **Create repository**.

## Paso 2. Activa la publicación (una sola vez)

1. En tu repositorio entra a **Settings** → **Pages**.
2. En **Source**, elige **GitHub Actions**.

## Paso 3. Cambia tus datos

1. Abre `src/data/marca.json` y pulsa el **lápiz** (✏️ *Edit this file*).
2. Cambia **solo lo que está entre comillas** a la derecha de cada dato. No borres comillas, comas ni llaves.
3. Pulsa **Commit changes** → **Commit changes** otra vez.
4. Repite con `src/data/productos.json`.

**Cómo escribir los datos:**

- **Colores:** con `#` y 6 caracteres, por ejemplo `"#1F6F5B"`.
- **Fuentes:** el nombre exacto de una fuente de [Google Fonts](https://fonts.google.com) que tenga **Regular y Bold**.
- **Esquinas:** `"rectas"`, `"suaves"` o `"redondas"`.
- **WhatsApp de la tienda:** `51` + 9 dígitos (ejemplo: `"51900000000"`). Usa el número que te indique tu docente.
- **Precio y costo de delivery:** números **sin comillas**, con punto decimal (ejemplo: `12.5`).
- **`ofreceDelivery`:** `true` o `false`, **sin comillas**.
- **Yape / Plin:** 9 dígitos que empiecen con 9 (ejemplo: `"900000000"`). Usa **el número ficticio o del aula** que te indique tu docente.
- **QR:** déjalo vacío (`""`) para mostrar el recuadro «QR de ejemplo».
- **Productos:** cada uno lleva un **`id` único** en minúsculas, sin espacios ni tildes (ejemplo: `"pan-integral"`). Copia un bloque completo `{ ... }`, pégalo debajo y sepáralos con una coma. Máximo 12.

## Paso 4. Sube tus imágenes

1. Entra a la carpeta `public/productos/`.
2. Pulsa **Add file** → **Upload files**, arrastra tus fotos y pulsa **Commit changes**.
3. En `productos.json`, escribe el **nombre exacto** del archivo (ejemplo: `"productos/pan-integral.jpg"`).
4. Para el logo, sube tu archivo a la carpeta `public/` y escribe su nombre en `marca.json`, en `"logo"`.

**Consejos:** nombres en minúscula sin espacios ni tildes; fotos de **menos de 300 KB**, horizontales (4:3), reales y con luz natural.

## Paso 5. Mira y prueba tu tienda

1. En la pestaña **Actions** verás el proceso de publicación. Cuando aparezca ✅, tu tienda estará en:
   `https://TU-USUARIO.github.io/NOMBRE-DE-TU-REPOSITORIO/`
2. Si aparece ❌, abre el proceso en rojo: el mensaje te dice **qué dato corregir**.
3. **Haz la compra completa tú mismo:** añade productos → carrito → cambia cantidades → finalizar compra → prueba **los dos métodos de pago** y **recojo y delivery** → confirma → revisa el mensaje de WhatsApp.
4. **Pide a 3 personas** que compren sin ayuda. Observa dónde dudan y mejora **2 cosas**.

## Lista de cotejo antes de entregar

- ☐ Cambié nombre, eslogan, colores, fuentes y logo.
- ☐ Todos mis productos tienen **foto real, descripción, precio en soles** y un `id` distinto.
- ☐ Probé **añadir al carrito, cambiar cantidades y quitar** productos.
- ☐ Probé el checkout con **efectivo** y con **Yape / Plin**, y con **recojo** y **delivery**.
- ☐ El total del pedido es correcto.
- ☐ El mensaje de WhatsApp sale completo y con el número que indicó mi docente.
- ☐ Usé datos ficticios y **no** publiqué números ni QR de pago reales.
- ☐ Los textos son verdaderos (si usé IA, los revisé y los corregí).
- ☐ Abrí la tienda en el celular y se ve bien.
- ☐ Probé con 3 personas y apliqué 2 mejoras.
- ☐ Envié el enlace de mi tienda a mi docente.

---

## Notas para el docente

**Publicar la plantilla**

1. Cree un repositorio **público** con estos archivos y active **Template repository** en *Settings*.
2. Haga una **prueba completa con una cuenta nueva** antes de la clase: usar la plantilla, activar Pages con *GitHub Actions*, editar datos, subir una imagen y **hacer una compra de prueba** en el sitio publicado.
3. Verifique en la documentación de Astro la versión vigente de la acción `withastro/action` (hoy en `publicar.yml` figura `@v3`) y de `actions/deploy-pages`.
4. En repositorios **privados**, GitHub Pages puede requerir un plan de pago; por eso los repositorios de los estudiantes deben ser **públicos**.

**Qué hace la plantilla por usted**

- **Carrito y pedido sin servidor:** el carrito se guarda en el navegador y el pedido se envía por WhatsApp con el mensaje ya armado. Los precios se leen siempre del catálogo (no se guardan en el carrito), así que si el estudiante cambia un precio, el carrito se actualiza.
- **Validación de datos al publicar**, con mensajes en español: colores mal escritos, precios con comillas, `id` repetidos, número de WhatsApp o de Yape/Plin inválido, imágenes que no existen, fuentes que no están en Google Fonts con Regular y Negrita.
- **Formulario accesible:** errores por campo, foco en el primer error y anuncios para lectores de pantalla.
- **Colores legibles:** elige solo el color del texto (blanco o negro) sobre los colores de marca y avisa si el texto y el fondo contrastan poco.
- **Dirección automática** para GitHub Pages desde `astro.config.mjs`.

**Límites que conviene explicar a los estudiantes**

- No hay inventario ni confirmación automática: la tienda valida el pedido y el pago por WhatsApp, como muchos emprendimientos reales.
- Los datos del cliente se guardan solo en su navegador y viajan únicamente en el mensaje de WhatsApp que él decide enviar.
- Sin pasarela de pago: efectivo y Yape/Plin se confirman manualmente.

**Probar en su computadora** (opcional; requiere Node.js 18.20+ o 20+)

```bash
npm install
npm run dev
```

**Privacidad:** consulte la política del colegio y, si corresponde, la autorización de los padres antes de que los estudiantes creen cuentas y publiquen tiendas. Pida siempre datos de contacto y de pago ficticios o del aula.

// Lógica del carrito y del pedido. Los estudiantes NO necesitan editar este archivo.
// Todo se guarda en el navegador de quien compra; no hay servidor ni cobro real.

type Producto = { id: string; nombre: string; precio: number; imagen: string };
type Config = {
  clave: string;
  nombre: string;
  productos: Producto[];
  rutas: { inicio: string; carrito: string; checkout: string; confirmacion: string };
  whatsapp: string;
  tienda: { recojo: string; ofreceDelivery: boolean; delivery: string; costoDelivery: number };
  pagos: { efectivo: string; yapePlin: { numero: string; titular: string; qr: string; instrucciones: string } };
};
type Item = { id: string; cantidad: number };
type Linea = { id: string; nombre: string; precio: number; cantidad: number };
type Pedido = {
  numero: string;
  cliente: { nombre: string; celular: string; correo: string };
  entrega: 'recojo' | 'delivery';
  direccion: string;
  referencia: string;
  pago: 'efectivo' | 'yapeplin';
  lineas: Linea[];
  subtotal: number;
  envio: number;
  total: number;
};

const MAX_POR_PRODUCTO = 20;
const cfg: Config = JSON.parse(document.getElementById('config-tienda')!.textContent || '{}');
const catalogo = new Map(cfg.productos.map((p) => [p.id, p]));
const CLAVE_CARRITO = `tienda:${cfg.clave}:carrito`;
const CLAVE_PEDIDO = `tienda:${cfg.clave}:pedido`;

const soles = (n: number) => `S/ ${n.toFixed(2)}`;

// ---------- Guardado (con respaldo en memoria si el navegador bloquea el almacenamiento) ----------
const memoria: Record<string, string> = {};
function leer<T>(clave: string, defecto: T): T {
  try {
    const t = localStorage.getItem(clave) ?? memoria[clave];
    return t ? (JSON.parse(t) as T) : defecto;
  } catch {
    return memoria[clave] ? (JSON.parse(memoria[clave]) as T) : defecto;
  }
}
function guardar(clave: string, valor: unknown) {
  const texto = JSON.stringify(valor);
  memoria[clave] = texto;
  try {
    localStorage.setItem(clave, texto);
  } catch {
    /* sin almacenamiento: se usa la memoria */
  }
}
function borrar(clave: string) {
  delete memoria[clave];
  try {
    localStorage.removeItem(clave);
  } catch {
    /* nada */
  }
}

// ---------- Carrito ----------
function getCarrito(): Item[] {
  const crudo = leer<Item[]>(CLAVE_CARRITO, []);
  return crudo.filter(
    (i) => catalogo.has(i.id) && Number.isInteger(i.cantidad) && i.cantidad >= 1 && i.cantidad <= MAX_POR_PRODUCTO,
  );
}
function setCarrito(items: Item[]) {
  guardar(CLAVE_CARRITO, items);
  actualizarContador();
}
function agregar(id: string) {
  const items = getCarrito();
  const existente = items.find((i) => i.id === id);
  if (existente) existente.cantidad = Math.min(MAX_POR_PRODUCTO, existente.cantidad + 1);
  else items.push({ id, cantidad: 1 });
  setCarrito(items);
}
function cambiarCantidad(id: string, delta: number) {
  const items = getCarrito()
    .map((i) => (i.id === id ? { ...i, cantidad: Math.min(MAX_POR_PRODUCTO, i.cantidad + delta) } : i))
    .filter((i) => i.cantidad > 0);
  setCarrito(items);
}
function quitar(id: string) {
  setCarrito(getCarrito().filter((i) => i.id !== id));
}
function lineasDelCarrito(): Linea[] {
  return getCarrito().map((i) => {
    const p = catalogo.get(i.id)!;
    return { id: i.id, nombre: p.nombre, precio: p.precio, cantidad: i.cantidad };
  });
}
const sumar = (lineas: Linea[]) => lineas.reduce((t, l) => t + l.precio * l.cantidad, 0);

// ---------- Utilidades de pantalla ----------
function h(tag: string, props: Record<string, string> = {}, ...hijos: (Node | string)[]) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k === 'class') e.className = v;
    else e.setAttribute(k, v);
  }
  e.append(...hijos);
  return e;
}
function anunciar(texto: string) {
  const zona = document.getElementById('anuncios');
  if (zona) zona.textContent = texto;
}
function actualizarContador() {
  const total = getCarrito().reduce((t, i) => t + i.cantidad, 0);
  document.querySelectorAll<HTMLElement>('[data-contador]').forEach((e) => {
    e.textContent = String(total);
    e.hidden = total === 0;
  });
  document
    .querySelectorAll<HTMLElement>('.carrito-enlace')
    .forEach((e) => e.setAttribute('aria-label', `Carrito, ${total} ${total === 1 ? 'producto' : 'productos'}`));
}
function pintarResumen(contenedor: HTMLElement, lineas: Linea[], envio: number) {
  const subtotal = sumar(lineas);
  const lista = h('ul', { class: 'resumen-lista' });
  lineas.forEach((l) =>
    lista.append(
      h(
        'li',
        {},
        h('span', {}, `${l.cantidad} × ${l.nombre}`),
        h('span', {}, soles(l.precio * l.cantidad)),
      ),
    ),
  );
  contenedor.replaceChildren(
    lista,
    h('p', { class: 'resumen-fila' }, h('span', {}, 'Subtotal'), h('span', {}, soles(subtotal))),
    h('p', { class: 'resumen-fila' }, h('span', {}, 'Entrega'), h('span', {}, envio > 0 ? soles(envio) : 'Sin costo')),
    h('p', { class: 'resumen-fila resumen-total' }, h('span', {}, 'Total'), h('span', {}, soles(subtotal + envio))),
  );
}

// ---------- Catálogo ----------
function iniciarCatalogo() {
  document.querySelectorAll<HTMLButtonElement>('[data-agregar]').forEach((boton) => {
    const textoOriginal = boton.textContent || 'Añadir al carrito';
    let reloj: number | undefined;
    boton.addEventListener('click', () => {
      agregar(boton.dataset.agregar!);
      boton.textContent = '✔ Añadido';
      boton.classList.add('anadido');
      anunciar(`${boton.dataset.nombre} añadido al carrito`);
      window.clearTimeout(reloj);
      reloj = window.setTimeout(() => {
        boton.textContent = textoOriginal;
        boton.classList.remove('anadido');
      }, 1600);
    });
  });
}

// ---------- Carrito (pantalla) ----------
function pintarCarrito() {
  const cont = document.getElementById('carrito');
  if (!cont) return;
  const lineas = lineasDelCarrito();

  if (lineas.length === 0) {
    cont.replaceChildren(
      h('p', {}, 'Tu carrito está vacío. Añade productos para empezar tu pedido.'),
      h('a', { class: 'boton', href: `${cfg.rutas.inicio}#productos` }, 'Ver productos'),
    );
    return;
  }

  const lista = h('ul', { class: 'carrito-lista' });
  lineas.forEach((l) => {
    const p = catalogo.get(l.id)!;
    lista.append(
      h(
        'li',
        { class: 'carrito-fila' },
        h('img', { src: p.imagen, alt: '', width: '88', height: '66' }),
        h(
          'div',
          { class: 'carrito-info' },
          h('strong', {}, l.nombre),
          h('span', {}, `${soles(l.precio)} c/u`),
          h('button', { type: 'button', class: 'enlace-boton', 'data-quitar': l.id }, `Quitar ${l.nombre}`),
        ),
        h(
          'div',
          { class: 'cantidad', role: 'group', 'aria-label': `Cantidad de ${l.nombre}` },
          h('button', { type: 'button', 'data-menos': l.id, 'aria-label': `Quitar una unidad de ${l.nombre}` }, '−'),
          h('output', { 'aria-live': 'polite' }, String(l.cantidad)),
          h('button', { type: 'button', 'data-mas': l.id, 'aria-label': `Añadir una unidad de ${l.nombre}` }, '+'),
        ),
        h('span', { class: 'carrito-subtotal' }, soles(l.precio * l.cantidad)),
      ),
    );
  });

  const resumen = h('aside', { class: 'resumen', 'aria-label': 'Resumen del pedido' }, h('h2', {}, 'Resumen del pedido'));
  const subtotal = sumar(lineas);
  resumen.append(
    h('p', { class: 'resumen-fila' }, h('span', {}, 'Subtotal'), h('span', {}, soles(subtotal))),
    h('p', { class: 'resumen-fila' }, h('span', {}, 'Entrega'), h('span', {}, 'Se elige en el pago')),
    h('p', { class: 'resumen-fila resumen-total' }, h('span', {}, 'Total (sin entrega)'), h('span', {}, soles(subtotal))),
    h('a', { class: 'boton', href: cfg.rutas.checkout }, 'Finalizar compra'),
    h('a', { class: 'boton boton-borde', href: `${cfg.rutas.inicio}#productos` }, 'Seguir comprando'),
  );

  cont.replaceChildren(lista, resumen);
  cont.querySelectorAll<HTMLElement>('[data-mas]').forEach((b) =>
    b.addEventListener('click', () => {
      cambiarCantidad(b.dataset.mas!, 1);
      pintarCarrito();
    }),
  );
  cont.querySelectorAll<HTMLElement>('[data-menos]').forEach((b) =>
    b.addEventListener('click', () => {
      cambiarCantidad(b.dataset.menos!, -1);
      pintarCarrito();
    }),
  );
  cont.querySelectorAll<HTMLElement>('[data-quitar]').forEach((b) =>
    b.addEventListener('click', () => {
      quitar(b.dataset.quitar!);
      pintarCarrito();
      anunciar('Producto quitado del carrito');
    }),
  );
}

// ---------- Checkout ----------
function iniciarCheckout() {
  const form = document.getElementById('form-pedido') as HTMLFormElement | null;
  if (!form) return;
  const vacio = document.getElementById('checkout-vacio')!;
  const contenido = document.getElementById('checkout-contenido')!;
  const lineas = lineasDelCarrito();
  if (lineas.length === 0) {
    vacio.hidden = false;
    contenido.hidden = true;
    return;
  }

  const resumen = document.getElementById('resumen')!;
  const datosDelivery = document.getElementById('datos-delivery')!;
  const valor = (n: string) => (form.elements.namedItem(n) as HTMLInputElement).value.trim();
  const marcado = (n: string) => form.querySelector<HTMLInputElement>(`input[name="${n}"]:checked`)?.value ?? '';
  const envio = () => (marcado('entrega') === 'delivery' ? cfg.tienda.costoDelivery : 0);

  const refrescar = () => {
    datosDelivery.hidden = marcado('entrega') !== 'delivery';
    (document.getElementById('panel-efectivo') as HTMLElement).hidden = marcado('pago') !== 'efectivo';
    (document.getElementById('panel-yapeplin') as HTMLElement).hidden = marcado('pago') !== 'yapeplin';
    pintarResumen(resumen, lineas, envio());
  };
  form.addEventListener('change', refrescar);
  refrescar();

  const poner = (id: string, mensaje: string) => {
    const e = document.getElementById(`err-${id}`)!;
    e.textContent = mensaje;
    e.hidden = !mensaje;
    document.getElementById(id)?.setAttribute('aria-invalid', mensaje ? 'true' : 'false');
  };

  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const errores: Record<string, string> = {};
    if (valor('nombre').length < 3) errores.nombre = 'Escribe tu nombre completo.';
    if (!/^9\d{8}$/.test(valor('celular'))) errores.celular = 'Escribe un celular de 9 dígitos que empiece con 9.';
    if (valor('correo') && !/^\S+@\S+\.\S+$/.test(valor('correo'))) errores.correo = 'Revisa el correo: falta el @ o el punto.';
    if (marcado('entrega') === 'delivery' && valor('direccion').length < 5) errores.direccion = 'Escribe la dirección de entrega.';
    if (!marcado('pago')) errores.pago = 'Elige cómo vas a pagar.';
    ['nombre', 'celular', 'correo', 'direccion', 'pago'].forEach((c) => poner(c, errores[c] ?? ''));

    const primero = ['nombre', 'celular', 'correo', 'direccion', 'pago'].find((c) => errores[c]);
    if (primero) {
      const campo = document.getElementById(primero) ?? form.querySelector<HTMLElement>('input[name="pago"]');
      campo?.focus();
      anunciar('Hay datos por corregir en el formulario');
      return;
    }

    const subtotal = sumar(lineas);
    const pedido: Pedido = {
      numero: String(Math.floor(Math.random() * 9000) + 1000),
      cliente: { nombre: valor('nombre'), celular: valor('celular'), correo: valor('correo') },
      entrega: marcado('entrega') as Pedido['entrega'],
      direccion: valor('direccion'),
      referencia: valor('referencia'),
      pago: marcado('pago') as Pedido['pago'],
      lineas,
      subtotal,
      envio: envio(),
      total: subtotal + envio(),
    };
    guardar(CLAVE_PEDIDO, pedido);
    borrar(CLAVE_CARRITO);
    window.location.href = cfg.rutas.confirmacion;
  });
}

// ---------- Confirmación ----------
function mensajePedido(p: Pedido) {
  const lineas = p.lineas.map((l) => `- ${l.cantidad} x ${l.nombre} (${soles(l.precio)}) = ${soles(l.precio * l.cantidad)}`);
  return [
    `Hola, quiero confirmar mi pedido N.º ${p.numero}`,
    '',
    'Productos:',
    ...lineas,
    '',
    `Subtotal: ${soles(p.subtotal)}`,
    p.entrega === 'delivery' ? `Delivery: ${soles(p.envio)}` : 'Entrega: recojo',
    `Total: ${soles(p.total)}`,
    '',
    `Pago: ${p.pago === 'efectivo' ? 'Efectivo' : 'Yape / Plin (te enviaré la captura del pago)'}`,
    ...(p.entrega === 'delivery'
      ? [`Dirección: ${p.direccion}`, ...(p.referencia ? [`Referencia: ${p.referencia}`] : [])]
      : []),
    '',
    `Nombre: ${p.cliente.nombre}`,
    `Celular: ${p.cliente.celular}`,
    ...(p.cliente.correo ? [`Correo: ${p.cliente.correo}`] : []),
  ].join('\n');
}

function iniciarConfirmacion() {
  const cont = document.getElementById('confirmacion');
  if (!cont) return;
  const p = leer<Pedido | null>(CLAVE_PEDIDO, null);

  if (!p) {
    cont.replaceChildren(
      h('h1', {}, 'No hay un pedido para mostrar'),
      h('p', {}, 'Empieza eligiendo tus productos.'),
      h('a', { class: 'boton', href: `${cfg.rutas.inicio}#productos` }, 'Ver productos'),
    );
    return;
  }

  const resumen = h('div', {});
  pintarResumen(resumen, p.lineas, p.envio);

  const pasos = h('ol', { class: 'pasos' });
  pasos.append(h('li', {}, 'Pulsa el botón verde para enviar tu pedido por WhatsApp.'));
  if (p.pago === 'yapeplin') {
    const y = cfg.pagos.yapePlin;
    pasos.append(
      h('li', {}, `Paga ${soles(p.total)} por Yape o Plin al ${y.numero} (titular: ${y.titular}) y envía la captura por el mismo chat.`),
    );
  } else {
    pasos.append(h('li', {}, cfg.pagos.efectivo));
  }
  pasos.append(
    h('li', {}, p.entrega === 'delivery' ? 'Coordinaremos contigo la hora de entrega.' : cfg.tienda.recojo + '.'),
  );

  cont.replaceChildren(
    h('p', { class: 'insignia', 'aria-hidden': 'true' }, '✔'),
    h('h1', {}, '¡Gracias por tu pedido!'),
    h('p', { class: 'numero-pedido' }, `Pedido N.º ${p.numero}`),
    h('p', {}, 'Tu pedido todavía no se ha enviado. Falta un último paso:'),
    pasos,
    h(
      'a',
      {
        class: 'boton boton-whatsapp',
        href: `https://wa.me/${cfg.whatsapp}?text=${encodeURIComponent(mensajePedido(p))}`,
        target: '_blank',
        rel: 'noopener',
      },
      'Enviar mi pedido por WhatsApp',
    ),
    h('h2', {}, 'Resumen'),
    resumen,
    h('a', { class: 'boton boton-borde', href: cfg.rutas.inicio }, 'Volver al inicio'),
  );
}

// ---------- Arranque ----------
actualizarContador();
iniciarCatalogo();
pintarCarrito();
iniciarCheckout();
iniciarConfirmacion();
window.addEventListener('storage', () => {
  actualizarContador();
  pintarCarrito();
});

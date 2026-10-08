const CLAVE_CARRITO = "circuito-carrito";
const ENVIO_FIJO = 12;
const ENVIO_GRATIS_DESDE = 100;

function obtenerCarrito() {
  const guardado = localStorage.getItem(CLAVE_CARRITO);
  if (!guardado) {
    return [];
  }

  try {
    const carrito = JSON.parse(guardado);
    return Array.isArray(carrito) ? carrito : [];
  } catch {
    return [];
  }
}

function guardarCarrito(carrito) {
  localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
  mostrarCarrito();
}

function cantidadTotal(carrito) {
  return carrito.reduce((total, item) => total + item.cantidad, 0);
}

function calcularSubtotal(carrito) {
  return carrito.reduce((total, item) => total + item.precio * item.cantidad, 0);
}

function mostrarAviso(texto) {
  const aviso = document.getElementById("aviso");
  if (!aviso || typeof bootstrap === "undefined") {
    return;
  }

  aviso.querySelector(".toast-body").textContent = texto;
  bootstrap.Toast.getOrCreateInstance(aviso, { delay: 2200 }).show();
}

function agregarAlCarrito(producto) {
  const carrito = obtenerCarrito();
  const existente = carrito.find((item) => item.id === producto.id);

  if (existente) {
    existente.cantidad += 1;
  } else {
    carrito.push({
      id: producto.id,
      titulo: producto.title,
      precio: producto.price,
      imagen: producto.image,
      cantidad: 1,
    });
  }

  guardarCarrito(carrito);
  mostrarAviso(`"${producto.title}" se agregó al carrito.`);
}

function cambiarCantidad(id, delta) {
  const carrito = obtenerCarrito();
  const item = carrito.find((producto) => producto.id === id);
  if (!item) {
    return;
  }

  item.cantidad += delta;
  const actualizado = item.cantidad > 0 ? carrito : carrito.filter((producto) => producto.id !== id);
  guardarCarrito(actualizado);
}

function quitarDelCarrito(id) {
  guardarCarrito(obtenerCarrito().filter((producto) => producto.id !== id));
}

function vaciarCarrito() {
  guardarCarrito([]);
}

function mostrarCarrito() {
  const carrito = obtenerCarrito();
  const contador = document.getElementById("contador-carrito");
  if (contador) {
    contador.textContent = String(cantidadTotal(carrito));
  }

  const lista = document.getElementById("carrito-items");
  if (!lista) {
    return;
  }

  const vacio = document.getElementById("carrito-vacio");
  const resumen = document.getElementById("carrito-resumen");
  lista.innerHTML = "";

  if (carrito.length === 0) {
    vacio.classList.remove("d-none");
    resumen.classList.add("d-none");
    return;
  }

  vacio.classList.add("d-none");
  resumen.classList.remove("d-none");

  carrito.forEach((item) => {
    const fila = document.createElement("article");
    fila.className = "carrito-item";
    fila.innerHTML = `
      <img src="${item.imagen}" alt="${item.titulo}" />
      <div class="flex-grow-1">
        <div class="fw-semibold">${item.titulo}</div>
        <div class="producto-precio">$${(item.precio * item.cantidad).toFixed(2)}</div>
      </div>
      <div class="btn-group" role="group" aria-label="Cantidad de ${item.titulo}">
        <button type="button" class="btn btn-outline-secondary" data-accion="menos" data-id="${item.id}" aria-label="Restar uno">−</button>
        <span class="btn btn-outline-secondary disabled">${item.cantidad}</span>
        <button type="button" class="btn btn-outline-secondary" data-accion="mas" data-id="${item.id}" aria-label="Sumar uno">+</button>
      </div>
      <button type="button" class="btn btn-outline-danger" data-accion="quitar" data-id="${item.id}" aria-label="Quitar ${item.titulo}">
        <i class="bi bi-trash" aria-hidden="true"></i>
      </button>
    `;
    lista.appendChild(fila);
  });

  const subtotal = calcularSubtotal(carrito);
  const envio = subtotal >= ENVIO_GRATIS_DESDE ? 0 : ENVIO_FIJO;
  document.getElementById("carrito-subtotal").textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById("carrito-envio").textContent = envio === 0 ? "Gratis" : `$${envio.toFixed(2)}`;
  document.getElementById("carrito-total").textContent = `$${(subtotal + envio).toFixed(2)}`;
}

document.addEventListener("click", (evento) => {
  const boton = evento.target.closest("[data-accion]");
  if (!boton) {
    return;
  }

  const id = Number(boton.dataset.id);
  if (boton.dataset.accion === "mas") {
    cambiarCantidad(id, 1);
  } else if (boton.dataset.accion === "menos") {
    cambiarCantidad(id, -1);
  } else if (boton.dataset.accion === "quitar") {
    quitarDelCarrito(id);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  mostrarCarrito();

  document.getElementById("btn-vaciar")?.addEventListener("click", vaciarCarrito);
  document.getElementById("btn-comprar")?.addEventListener("click", () => {
    if (obtenerCarrito().length === 0) {
      return;
    }
    vaciarCarrito();
    mostrarAviso("Compra registrada. Gracias por tu pedido.");
  });
});

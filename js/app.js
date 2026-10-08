const API_URL = "https://fakestoreapi.com/products";

let productos = [];

function cargarProductos() {
  const estado = document.getElementById("estado-carga");
  const mensajeError = document.getElementById("mensaje-error");
  const contenedor = document.getElementById("productos-container");

  estado.hidden = false;
  estado.textContent = "Cargando productos...";
  mensajeError.classList.add("d-none");
  contenedor.innerHTML = "";

  fetch(API_URL)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      productos = data;
      estado.hidden = true;
      mostrarProductos(productos);
    })
    .catch((error) => {
      console.error("Error en la comunicación con la API:", error);
      estado.hidden = true;
      mensajeError.classList.remove("d-none");
    });
}

function mostrarProductos(lista) {
  const contenedor = document.getElementById("productos-container");
  contenedor.innerHTML = "";

  if (lista.length === 0) {
    contenedor.innerHTML = `
      <p class="col-12 text-center text-muted py-4 mb-0">
        No hay productos que coincidan con la búsqueda.
      </p>
    `;
    return;
  }

  lista.forEach((producto) => {
    const columna = document.createElement("div");
    columna.className = "col-12 col-sm-6 col-lg-4 col-xl-3";
    columna.innerHTML = `
      <article class="card producto-card">
        <div class="producto-imagen-wrap">
          <img class="producto-imagen" src="${producto.image}" alt="${producto.title}" />
        </div>
        <div class="card-body d-flex flex-column">
          <p class="producto-categoria mb-1">${producto.category}</p>
          <h3 class="producto-titulo">${producto.title}</h3>
          <div class="d-flex justify-content-between align-items-center mt-auto pt-3">
            <span class="producto-precio">$${producto.price.toFixed(2)}</span>
            <span class="text-warning" aria-label="Calificación ${producto.rating.rate} de 5">
              <i class="bi bi-star-fill" aria-hidden="true"></i> ${producto.rating.rate}
            </span>
          </div>
          <button type="button" class="btn btn-agregar mt-3" data-id="${producto.id}">
            Añadir al carrito
          </button>
        </div>
      </article>
    `;
    contenedor.appendChild(columna);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  cargarProductos();

  document.getElementById("btn-reintentar").addEventListener("click", cargarProductos);

  document.getElementById("buscador").addEventListener("input", (evento) => {
    const termino = evento.target.value.trim().toLowerCase();
    const filtrados = productos.filter(
      (producto) =>
        producto.title.toLowerCase().includes(termino) ||
        producto.category.toLowerCase().includes(termino)
    );
    mostrarProductos(filtrados);
  });

  document.getElementById("productos-container").addEventListener("click", (evento) => {
    const boton = evento.target.closest(".btn-agregar");
    if (!boton) {
      return;
    }

    const producto = productos.find((item) => item.id === Number(boton.dataset.id));
    if (producto) {
      agregarAlCarrito(producto);
    }
  });
});

const formulario = document.getElementById("formulario-contacto");
const mensaje = document.getElementById("mensaje");
const contador = document.getElementById("contador-caracteres");

mensaje.addEventListener("input", () => {
  contador.textContent = `${mensaje.value.length} / 1000`;
});

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const nombre = document.getElementById("nombre");
  const email = document.getElementById("email");
  const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
  let valido = true;

  if (nombre.value.trim().length < 3) {
    nombre.classList.add("is-invalid");
    valido = false;
  } else {
    nombre.classList.remove("is-invalid");
  }

  if (!correoValido) {
    email.classList.add("is-invalid");
    valido = false;
  } else {
    email.classList.remove("is-invalid");
  }

  if (mensaje.value.trim().length < 10) {
    mensaje.classList.add("is-invalid");
    valido = false;
  } else {
    mensaje.classList.remove("is-invalid");
  }

  if (!valido) {
    formulario.querySelector(".is-invalid")?.focus();
    return;
  }

  formulario.reset();
  contador.textContent = "0 / 1000";
  nombre.classList.remove("is-invalid");
  email.classList.remove("is-invalid");
  mensaje.classList.remove("is-invalid");

  let alerta = document.getElementById("alerta-formulario");
  if (!alerta) {
    alerta = document.createElement("div");
    alerta.id = "alerta-formulario";
    alerta.setAttribute("role", "status");
    formulario.appendChild(alerta);
  }
  alerta.className = "alert alert-success mt-3 mb-0";
  alerta.textContent = "Mensaje listo. En una tienda real esto se enviaría al servidor.";
});

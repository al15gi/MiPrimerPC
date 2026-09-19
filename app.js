let todosLosProductos = [];

async function cargarProductos() {
  try {
    const respuesta = await fetch("productos.json");
    if (!respuesta.ok) throw new Error("No se pudo cargar productos.json");
    todosLosProductos = await respuesta.json();
    mostrarProductos(todosLosProductos);
  } catch (error) {
    console.error(error);
    document.getElementById("contenedor-productos").innerHTML =
      '<p class="error">No se pudieron cargar los productos. Comprueba que productos.json esté en la raíz del repositorio.</p>';
  }
}

function escaparHTML(texto) {
  return String(texto)
    .replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")
    .replaceAll('"',"&quot;").replaceAll("'","&#039;");
}

function mostrarProductos(lista) {
  const contenedor = document.getElementById("contenedor-productos");
  const sinResultados = document.getElementById("sin-resultados");
  contenedor.innerHTML = "";
  sinResultados.hidden = lista.length !== 0;

  lista.forEach(producto => {
    const tarjeta = document.createElement("article");
    tarjeta.className = "tarjeta";
    tarjeta.innerHTML = `
      <img src="${producto.imagen}" alt="${escaparHTML(producto.nombre)}" loading="lazy">
      <div class="contenido-tarjeta">
        <span class="etiqueta">${escaparHTML(producto.categoria)}</span>
        <h3>${escaparHTML(producto.nombre)}</h3>
        <p>${escaparHTML(producto.descripcion)}</p>
        <a href="${producto.enlace}" target="_blank" rel="nofollow sponsored noopener" class="btn-amazon">
          Ver en Amazon →
        </a>
      </div>`;
    contenedor.appendChild(tarjeta);
  });
}

function filtrarPresupuesto(nivel) {
  document.querySelectorAll(".filtro").forEach(b =>
    b.classList.toggle("activo", b.dataset.filtro === nivel)
  );
  mostrarProductos(nivel === "todos"
    ? todosLosProductos
    : todosLosProductos.filter(p => p.presupuesto === nivel));
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".filtro").forEach(boton =>
    boton.addEventListener("click", () => filtrarPresupuesto(boton.dataset.filtro))
  );
  cargarProductos();
});

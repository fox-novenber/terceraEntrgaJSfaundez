const verduleria = [
    { id: 1, producto: "manzana",   precio: 150, origen: "nacional",  imagen: "manzana.jpeg" },
    { id: 2, producto: "naranja",   precio: 100, origen: "nacional",  imagen: "naranja.jpeg" },
    { id: 3, producto: "banana",    precio: 200, origen: "importado", imagen: "banana.jpeg" },
    { id: 4, producto: "peras",     precio: 80,  origen: "nacional",  imagen: "pera.jpeg" },
    { id: 5, producto: "frutillas", precio: 350, origen: "importado", imagen: "frutilla.jpeg" },
    { id: 6, producto: "tomates",   precio: 85,  origen: "nacional",  imagen: "tomate.jpeg" }
];

const tarjetas = document.getElementById("tarjetas");
const carritoContainer = document.getElementById("carrito");
const totalSpan = document.getElementById("total");
const buscador = document.getElementById("buscador");
const botonesFiltro = document.querySelectorAll(".filtro");

// Carrito guardado en Local Storage (o vacío si no hay nada)
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let origenActual = "todos";

function crearTarjetas(lista) {
    tarjetas.innerHTML = "";
    if (lista.length === 0) {
        tarjetas.innerHTML = `<p class="vacio">No se encontraron productos.</p>`;
        return;
    }
    lista.forEach(p => {
        const tarjeta = document.createElement("div");
        tarjeta.className = "estiloTarjeta";
        tarjeta.innerHTML = `
            <img class="imagen" src="imagenes/${p.imagen}" alt="${p.producto}">
            <h3>${p.producto}</h3>
            <span class="origen">${p.origen}</span>
            <span class="precio">$${p.precio}</span>
            <button onclick="agregarAlCarrito(${p.id})">Agregar al carrito</button>
        `;
        tarjetas.appendChild(tarjeta);
    });
}

function mostrarCarrito() {
    carritoContainer.innerHTML = "";
    if (carrito.length === 0) {
        carritoContainer.innerHTML = `<p class="vacio">El carrito está vacío.</p>`;
    }
    carrito.forEach(item => {
        const fila = document.createElement("div");
        fila.className = "itemCarrito";
        fila.innerHTML = `
            <span>${item.producto} × ${item.cantidad}</span>
            <span>$${item.precio * item.cantidad}</span>
            <div>
                <button onclick="cambiarCantidad(${item.id}, -1)">-</button>
                <button onclick="cambiarCantidad(${item.id}, 1)">+</button>
                <button onclick="eliminarItem(${item.id})">🗑</button>
            </div>
        `;
        carritoContainer.appendChild(fila);
    });

    const total = carrito.reduce((suma, item) => suma + item.precio * item.cantidad, 0);
    totalSpan.textContent = total;

    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function agregarAlCarrito(id) {
    const item = carrito.find(i => i.id === id);
    if (item) {
        item.cantidad++;
    } else {
        const producto = verduleria.find(p => p.id === id);
        carrito.push({ ...producto, cantidad: 1 });
    }
    mostrarCarrito();
}

// Suma (+1) o resta (-1). Si llega a 0 se elimina.
function cambiarCantidad(id, cambio) {
    const item = carrito.find(i => i.id === id);
    if (!item) return;
    item.cantidad += cambio;
    if (item.cantidad <= 0) {
        eliminarItem(id);
    } else {
        mostrarCarrito();
    }
}

function eliminarItem(id) {
    carrito = carrito.filter(i => i.id !== id);
    mostrarCarrito();
}

// Un solo filtro que combina texto + origen
function filtrar() {
    const texto = buscador.value.toLowerCase().trim();
    const lista = verduleria.filter(p =>
        p.producto.includes(texto) &&
        (origenActual === "todos" || p.origen === origenActual)
    );
    crearTarjetas(lista);
}

buscador.addEventListener("input", filtrar);

botonesFiltro.forEach(boton => {
    boton.addEventListener("click", () => {
        origenActual = boton.dataset.origen;
        botonesFiltro.forEach(b => b.classList.remove("activo"));
        boton.classList.add("activo");
        filtrar();
    });
});

document.getElementById("vaciar").addEventListener("click", () => {
    carrito = [];
    mostrarCarrito();
});

crearTarjetas(verduleria);
mostrarCarrito();

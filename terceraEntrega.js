
const verduleria = [
    {id: 1, producto: "manzana", precio: 150, origen: "nacional", Imagen:"manzana.jpeg"},
    {id: 2, producto: "naranja", precio: 100, origen: "nacional", Imagen:"naranja.jpeg"},
    {id: 3, producto: "banana", precio: 200, origen: "importado", Imagen:"banana.jpeg"},
    {id: 4, producto: "peras", precio: 80, origen: "nacional", Imagen:"pera.jpeg"},
    {id: 5, producto: "frutillas", precio: 350, origen: "importado", Imagen:"frutilla.jpeg"},
    {id: 6, producto: "tomates", precio: 85, origen: "nacional", Imagen:"tomate.jpeg"}
];

let tarjetas = document.getElementById("tarjetas");
let carrito = [];

// Obtener datos del carrito desde el Local Storage (si existen)
const carritoJSON = localStorage.getItem("carrito");
if (carritoJSON) {
    carrito = JSON.parse(carritoJSON);
}

function crearTarjetas(verduleria) {
    tarjetas.innerHTML = "";
    verduleria.forEach(elemento => {
        let tarjetita = document.createElement("div");
        tarjetita.className = "estiloTarjeta";
        
        tarjetita.innerHTML = `
            <h3>${elemento.producto}</h3>
            <img class="imagen" src="imagenes/${elemento.Imagen}">
            <h3>${elemento.precio}$</h3>
            <button onclick="agregarAlCarrito(${elemento.id})">Agregar al carrito</button>
        `;
        tarjetas.appendChild(tarjetita);
    });
}

function mostrarCarrito() {
    let carritoContainer = document.getElementById("carrito");
    carritoContainer.innerHTML = "";
    carrito.forEach(item => {
        let itemCarrito = document.createElement("div");
        itemCarrito.className = "itemCarrito";
        
        itemCarrito.innerHTML = `
            <h3>${item.producto}</h3>
            <p>Precio: ${item.precio}$</p>
            <p>Cantidad: ${item.cantidad}</p>
            <button  class="fachaBotones" onclick="restarCantidad(${item.id})">-</button>
            <button class="fachaBotones" onclick="sumarCantidad(${item.id})">+</button>
            <button class="fachaBotones" onclick="eliminarItem(${item.id})">Eliminar</button>
        `;
        carritoContainer.appendChild(itemCarrito);
    });
    
    // Guardar los datos del carrito en el Local Storage
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function agregarAlCarrito(id) {
    let producto = verduleria.find(item => item.id === id);
    let itemCarrito = carrito.find(item => item.id === id);
    
    if (itemCarrito) {
        itemCarrito.cantidad++;
    } else {
        carrito.push({...producto, cantidad: 1});
    }
    
    mostrarCarrito();
}

function restarCantidad(id) {
    let itemCarrito = carrito.find(item => item.id === id);
    
    if (itemCarrito) {
        itemCarrito.cantidad--;
        if (itemCarrito.cantidad === 0) {
            eliminarItem(id);
        }
    }
    
    mostrarCarrito();
}

function sumarCantidad(id) {
    let itemCarrito = carrito.find(item => item.id === id);
    
    if (itemCarrito) {
        itemCarrito.cantidad++;
    }
    
    mostrarCarrito();
}

function eliminarItem(id) {
    carrito = carrito.filter(item => item.id !== id);
    mostrarCarrito();
}

let buscador = document.getElementById("buscador");
buscador.addEventListener("input", filtrar);

let boton = document.getElementById("botonBuscar");
boton.addEventListener("click", filtrar);

let botonImportados = document.getElementById("botonImportado");
botonImportados.addEventListener("click", filtrarPorCategoria);

let botonNacionales = document.getElementById("botonNacional");
botonNacionales.addEventListener("click", filtrarPorCategoria);

function filtrar() {
    let valorBusqueda = buscador.value.toLowerCase();
    let arrayFiltrado = verduleria.filter(fruta => 
        fruta.producto.toLowerCase().includes(valorBusqueda) ||
        fruta.origen.toLowerCase().includes(valorBusqueda)
    );
    crearTarjetas(arrayFiltrado);
}

function filtrarPorCategoria(e) {
    let categoria = e.target.value;
    let arrayFiltrado;
    if (categoria === "importado") {
        arrayFiltrado = verduleria.filter(fruta => fruta.origen === "importado");
    } else if (categoria === "nacional") {
        arrayFiltrado = verduleria.filter(fruta => fruta.origen === "nacional");
    } else {
        arrayFiltrado = verduleria;
    }
    crearTarjetas(arrayFiltrado);
}

crearTarjetas(verduleria);
mostrarCarrito();

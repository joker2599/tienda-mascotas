let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

const contenedor = document.getElementById('productos');

// Obtener productos
fetch('http://localhost:3000/api/productos')
.then(res => res.json())
.then(data => {

    data.forEach(p => {
        contenedor.innerHTML += `
        <div class="col-md-4">
            <div class="card mb-4 shadow">
                <img src="${p.imagen}" class="card-img-top">
                <div class="card-body">
                    <h5 class="card-title">${p.nombre}</h5>
                    <p class="card-text">$${p.precio}</p>
                    <button class="btn btn-primary" onclick='agregarCarrito(${JSON.stringify(p)})'>
                        Agregar al carrito
                    </button>
                </div>
            </div>
        </div>
        `;
    });

});

const contador = document.getElementById('contador');

function actualizarContador() {
    contador.innerText = carrito.length;
}


actualizarContador();


function agregarCarrito(producto) {
    carrito.push(producto);

    localStorage.setItem('carrito', JSON.stringify(carrito));

    actualizarContador();

    alert('Producto agregado 🤖');
}
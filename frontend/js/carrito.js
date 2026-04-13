const lista = document.getElementById('listaCarrito');
const totalElemento = document.getElementById('total');

let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

function mostrarCarrito() {
    lista.innerHTML = '';
    let total = 0;

    carrito.forEach((p, index) => {
        total += p.precio;

        lista.innerHTML += `
        <div class="card mb-3">
            <div class="card-body d-flex justify-content-between">
                <div>
                    <h5>${p.nombre}</h5>
                    <p>$${p.precio}</p>
                </div>
                <button class="btn btn-danger" onclick="eliminarProducto(${index})">
                    ❌
                </button>
            </div>
        </div>
        `;
    });

    totalElemento.innerText = total;
}

function eliminarProducto(index) {
    carrito.splice(index, 1);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    mostrarCarrito();
}

function vaciarCarrito() {
    carrito = [];
    localStorage.removeItem('carrito');
    mostrarCarrito();
}


mostrarCarrito();
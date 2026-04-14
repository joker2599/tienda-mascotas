let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

const contenedor = document.getElementById('productos');


let catalogo = [];

if (typeof actualizarContadorFavoritos === 'function') {
    actualizarContadorFavoritos();
}

function corazonFav(p) {
    const on =
        typeof estaEnFavoritos === 'function' && estaEnFavoritos(p);
    return on ? '♥' : '♡';
}

function clasesFav(p) {
    const on =
        typeof estaEnFavoritos === 'function' && estaEnFavoritos(p);
    return on
        ? 'btn btn-danger btn-sm btn-fav position-absolute top-0 end-0 m-2'
        : 'btn btn-light btn-sm btn-fav position-absolute top-0 end-0 m-2';
}

function ariaFav(p) {
    return typeof estaEnFavoritos === 'function' && estaEnFavoritos(p)
        ? 'true'
        : 'false';
}

function escapeHtml(s) {
    return String(s ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}


function safeImgSrc(u) {
    return String(u ?? '').replace(/["'<>]/g, '');
}


fetch('http://localhost:3000/api/productos')
    .then((res) => {
        if (!res.ok) throw new Error('No se pudieron cargar los productos');
        return res.json();
    })
    .then((data) => {
        if (!Array.isArray(data)) throw new Error('Respuesta inválida');
        catalogo = data;
        contenedor.innerHTML = '';
        data.forEach((p, index) => {
            const precio =
                p.precio != null && p.precio !== '' ? p.precio : '—';
            const nombre = escapeHtml(p.nombre);
            const imgSrc = safeImgSrc(p.imagen);
            contenedor.innerHTML += `
        <div class="col-md-4">
            <div class="card mb-4 shadow">
                <div class="producto-thumb">
                    <img src="${imgSrc}" alt="${nombre}" loading="lazy">
                    <button type="button" class="${clasesFav(p)}" title="Favorito" aria-pressed="${ariaFav(p)}"
                        data-idx="${index}" data-action="fav">
                        ${corazonFav(p)}
                    </button>
                </div>
                <div class="card-body">
                    <h5 class="card-title">${nombre}</h5>
                    <p class="card-text">$${precio}</p>
                    <button type="button" class="btn btn-primary" data-idx="${index}" data-action="cart">
                        Agregar al carrito
                    </button>
                </div>
            </div>
        </div>
        `;
        });
        contenedor.addEventListener('click', onProductosClick);
        if (typeof actualizarContadorFavoritos === 'function') {
            actualizarContadorFavoritos();
        }
    })
    .catch((err) => {
        console.error(err);
        contenedor.innerHTML = `<div class="col-12"><p class="alert alert-warning">No se pudieron cargar los productos. ¿Está el servidor en <code>http://localhost:3000</code>? (${escapeHtml(err.message)})</p></div>`;
    });

function onProductosClick(ev) {
    const btn = ev.target.closest('[data-action][data-idx]');
    if (!btn || !contenedor.contains(btn)) return;
    const i = parseInt(btn.getAttribute('data-idx'), 10);
    const p = catalogo[i];
    if (!p) return;
    const action = btn.getAttribute('data-action');
    if (action === 'cart') {
        agregarCarrito(p);
    } else if (action === 'fav') {
        
        toggleFavorito(p, { currentTarget: btn });
    }
}

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

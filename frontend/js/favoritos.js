const FAVORITOS_KEY = 'favoritos';

function idProducto(p) {
    if (p == null) return '';
    if (p._id != null) return String(p._id);
    return `${p.nombre || ''}::${p.imagen || ''}`;
}

function getFavoritos() {
    try {
        return JSON.parse(localStorage.getItem(FAVORITOS_KEY)) || [];
    } catch {
        return [];
    }
}

function setFavoritos(arr) {
    localStorage.setItem(FAVORITOS_KEY, JSON.stringify(arr));
}

function estaEnFavoritos(p) {
    const id = idProducto(p);
    return getFavoritos().some((x) => idProducto(x) === id);
}

function toggleFavorito(producto, ev) {
    let favs = getFavoritos();
    const id = idProducto(producto);
    const i = favs.findIndex((x) => idProducto(x) === id);
    if (i >= 0) {
        favs.splice(i, 1);
    } else {
        favs.push(producto);
    }
    setFavoritos(favs);
    actualizarContadorFavoritos();
    const btn = ev && ev.currentTarget;
    /* Solo actualizar un botón real (no el contenedor con delegación de eventos) */
    if (btn && btn.matches && btn.matches('button[data-action="fav"]')) {
        const activo = estaEnFavoritos(producto);
        btn.innerHTML = activo ? '♥' : '♡';
        btn.classList.toggle('btn-danger', activo);
        btn.classList.toggle('btn-light', !activo);
        btn.setAttribute('aria-pressed', activo ? 'true' : 'false');
    }
}

function actualizarContadorFavoritos() {
    const el = document.getElementById('contador-fav');
    if (el) el.innerText = getFavoritos().length;
}

function quitarFavorito(producto) {
    const id = idProducto(producto);
    const favs = getFavoritos().filter((x) => idProducto(x) !== id);
    setFavoritos(favs);
    actualizarContadorFavoritos();
    mostrarListaFavoritos();
}

function mostrarListaFavoritos() {
    const lista = document.getElementById('listaFavoritos');
    if (!lista) return;
    const favs = getFavoritos();
    lista.innerHTML = '';
    if (favs.length === 0) {
        lista.innerHTML =
            '<p class="text-muted">No tienes favoritos guardados. <a href="index.html">Ir a la tienda</a></p>';
        return;
    }
    favs.forEach((p) => {
        const precio =
            p.precio != null && p.precio !== '' ? p.precio : '—';
        lista.innerHTML += `
        <div class="card mb-3">
            <div class="card-body d-flex flex-wrap justify-content-between align-items-center gap-2">
                <div class="d-flex align-items-center gap-3">
                    <img src="${p.imagen}" alt="" class="rounded" style="width:72px;height:72px;object-fit:cover;">
                    <div>
                        <h5 class="mb-1">${p.nombre}</h5>
                        <p class="mb-0">$${precio}</p>
                    </div>
                </div>
                <div class="d-flex flex-wrap gap-2">
                    <button type="button" class="btn btn-primary btn-sm" onclick='agregarCarritoDesdeFav(${JSON.stringify(p)})'>
                        Al carrito
                    </button>
                    <button type="button" class="btn btn-outline-danger btn-sm" onclick='quitarFavorito(${JSON.stringify(p)})'>
                        Quitar ♥
                    </button>
                </div>
            </div>
        </div>`;
    });
}

function agregarCarritoDesdeFav(producto) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito.push(producto);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    alert('Producto agregado al carrito');
}

function vaciarFavoritos() {
    setFavoritos([]);
    actualizarContadorFavoritos();
    mostrarListaFavoritos();
}

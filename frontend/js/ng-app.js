/* AngularJS (1.x) app: componentes + binding (sin build)
   Nota: mantenido en sintaxis ES5 para máxima compatibilidad de navegador. */
(function () {
    'use strict';

    var API_URL = (function () {
        try {
            if (
                typeof window !== 'undefined' &&
                window.location &&
                (window.location.hostname === 'localhost' ||
                    window.location.hostname === '127.0.0.1') &&
                String(window.location.port) !== '' &&
                String(window.location.port) !== '3000'
            ) {
                return 'http://localhost:3000/api/productos';
            }
        } catch (e) {}
        return '/api/productos';
    })();

    var CARRITO_KEY = 'carrito';
    var FAVORITOS_KEY = 'favoritos';

    function idProducto(p) {
        if (p == null) return '';
        if (p._id != null) return String(p._id);
        return String(p.nombre || '') + '::' + String(p.imagen || '');
    }

    function safeImgSrc(u) {
        return String(u == null ? '' : u).replace(/["'<>]/g, '');
    }

    function hasBootstrapModal() {
        try {
            return (
                typeof window !== 'undefined' &&
                window.bootstrap &&
                window.bootstrap.Modal &&
                typeof window.bootstrap.Modal.getOrCreateInstance === 'function'
            );
        } catch (e) {
            return false;
        }
    }

    function tpl(lines) {
        return lines.join('');
    }

    angular
        .module('tiendaApp', [])
        .service('carritoService', function () {
            function get() {
                try {
                    return JSON.parse(localStorage.getItem(CARRITO_KEY)) || [];
                } catch (e) {
                    return [];
                }
            }
            function set(arr) {
                localStorage.setItem(CARRITO_KEY, JSON.stringify(arr));
            }
            this.listar = function () {
                return get();
            };
            this.contar = function () {
                return get().length;
            };
            this.agregar = function (producto) {
                var c = get();
                c.push(producto);
                set(c);
            };
        })
        .service('favoritosService', function () {
            function get() {
                try {
                    return JSON.parse(localStorage.getItem(FAVORITOS_KEY)) || [];
                } catch (e) {
                    return [];
                }
            }
            function set(arr) {
                localStorage.setItem(FAVORITOS_KEY, JSON.stringify(arr));
            }
            this.listar = function () {
                return get();
            };
            this.contar = function () {
                return get().length;
            };
            this.esta = function (p) {
                var id = idProducto(p);
                var favs = get();
                for (var i = 0; i < favs.length; i++) {
                    if (idProducto(favs[i]) === id) return true;
                }
                return false;
            };
            this.toggle = function (p) {
                var id = idProducto(p);
                var favs = get();
                var idx = -1;
                for (var i = 0; i < favs.length; i++) {
                    if (idProducto(favs[i]) === id) {
                        idx = i;
                        break;
                    }
                }
                if (idx >= 0) favs.splice(idx, 1);
                else favs.push(p);
                set(favs);
                return this.esta(p);
            };
        })
        .component('productoCard', {
            bindings: {
                producto: '<',
                onAddCart: '&',
                onToggleFav: '&',
                onVerMas: '&',
                esFavorito: '<',
            },
            controller: function () {
                this.safeImgSrc = safeImgSrc;
            },
            template: tpl([
                '<div class="card mb-4 shadow h-100">',
                '  <div class="producto-thumb">',
                '    <img ng-src="{{$ctrl.safeImgSrc($ctrl.producto.imagen)}}" alt="{{$ctrl.producto.nombre}}" loading="lazy">',
                '    <button type="button"',
                '      class="btn btn-sm btn-fav position-absolute top-0 end-0 m-2"',
                "      ng-class=\"$ctrl.esFavorito ? 'btn-danger' : 'btn-light'\"",
                '      aria-pressed="{{$ctrl.esFavorito ? \'true\':\'false\'}}"',
                '      title="Favorito"',
                '      ng-click="$ctrl.onToggleFav({producto: $ctrl.producto})">',
                "      {{$ctrl.esFavorito ? '♥' : '♡'}}",
                '    </button>',
                '  </div>',
                '  <div class="card-body d-flex flex-column">',
                '    <h5 class="card-title">{{$ctrl.producto.nombre}}</h5>',
                '    <p class="card-text mb-3">$<span>{{$ctrl.producto.precio || \'—\'}}</span></p>',
                '    <div class="mt-auto d-flex flex-wrap gap-2">',
                '      <button type="button" class="btn btn-primary" ng-click="$ctrl.onAddCart({producto: $ctrl.producto})">Agregar al carrito</button>',
                '      <button type="button" class="btn btn-outline-secondary" ng-click="$ctrl.onVerMas({producto: $ctrl.producto})">Ver más</button>',
                '    </div>',
                '  </div>',
                '</div>',
            ]),
        })
        .component('homePage', {
            controller: function ($http, carritoService, favoritosService) {
                var vm = this;
                vm.productos = [];
                vm.cargando = true;
                vm.error = '';
                vm.seleccionado = null;
                vm.contadorCarrito = carritoService.contar();
                vm.contadorFav = favoritosService.contar();

                vm.esFavorito = function (p) {
                    return favoritosService.esta(p);
                };

                vm.agregarCarrito = function (p) {
                    carritoService.agregar(p);
                    vm.contadorCarrito = carritoService.contar();
                    alert('Producto agregado 🤖');
                };

                vm.toggleFav = function (p) {
                    favoritosService.toggle(p);
                    vm.contadorFav = favoritosService.contar();
                };

                vm.verMas = function (p) {
                    vm.seleccionado = p;
                    var el = document.getElementById('modalVerMas');
                    if (el && hasBootstrapModal()) {
                        window.bootstrap.Modal.getOrCreateInstance(el).show();
                    }
                };

                vm.$onInit = function () {
                    $http
                        .get(API_URL)
                        .then(function (res) {
                            if (!res || !Array.isArray(res.data)) {
                                throw new Error('Respuesta inválida');
                            }
                            vm.productos = res.data;
                        })
                        .catch(function (err) {
                            vm.error =
                                (err && err.message) ||
                                'No se pudieron cargar los productos.';
                        })
                        .finally(function () {
                            vm.cargando = false;
                        });
                };
            },
            template: tpl([
                '<div class="container-fluid px-3 py-2">',
                '  <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">',
                '    <a href="contacto.html" class="text-decoration-none">Contacto</a>',
                '    <div class="text-end">',
                '      <a href="favoritos.html" class="text-decoration-none me-3 fs-5 fw-semibold link-dark">❤️ Favoritos (<span>{{$ctrl.contadorFav}}</span>)</a>',
                '      <span>🛒 Carrito: <span>{{$ctrl.contadorCarrito}}</span></span>',
                '    </div>',
                '  </div>',
                '</div>',
                '',
                '<div class="container mt-4">',
                '  <div class="d-flex justify-content-end flex-wrap gap-2 mb-2">',
                '    <a href="favoritos.html" class="btn btn-outline-danger btn-sm">❤️ Favoritos</a>',
                '    <a href="carrito.html" class="btn btn-success">🛒 Ver carrito</a>',
                '  </div>',
                '',
                '  <header class="p-4 p-lg-5 bg-white rounded-3 shadow-sm mb-4">',
                '    <div class="row align-items-center g-4">',
                '      <div class="col-lg-8">',
                '        <h1 class="display-6 mb-2">Tienda de Mascotas</h1>',
                '        <p class="lead mb-0">Todo para el bienestar de tu mejor amigo: alimentos, accesorios y servicios.</p>',
                '      </div>',
                '      <div class="col-lg-4 text-lg-end">',
                '        <a class="btn btn-primary me-2" href="#productos">Ver productos</a>',
                '        <a class="btn btn-outline-secondary" href="contacto.html">Hablar con nosotros</a>',
                '      </div>',
                '    </div>',
                '  </header>',
                '',
                '  <section class="mb-4">',
                '    <div class="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-2">',
                '      <h2 class="h4 mb-0">Servicios destacados</h2>',
                '      <a class="btn btn-sm btn-outline-primary" href="contacto.html">Agendar / Consultar</a>',
                '    </div>',
                '    <div class="row g-3">',
                '      <div class="col-md-4"><div class="card h-100 shadow-sm"><div class="card-body"><h3 class="h6">Veterinaria</h3><p class="mb-0 text-muted">Chequeos, vacunación y asesoría básica.</p></div></div></div>',
                '      <div class="col-md-4"><div class="card h-100 shadow-sm"><div class="card-body"><h3 class="h6">Peluquería</h3><p class="mb-0 text-muted">Baño, corte y cuidado para cada raza.</p></div></div></div>',
                '      <div class="col-md-4"><div class="card h-100 shadow-sm"><div class="card-body"><h3 class="h6">Accesorios</h3><p class="mb-0 text-muted">Juguetes, camas y todo lo esencial.</p></div></div></div>',
                '    </div>',
                '  </section>',
                '',
                '  <section class="p-4 bg-white rounded-3 shadow-sm mb-4">',
                '    <div class="row g-3 align-items-center">',
                '      <div class="col-md-8"><h2 class="h5 mb-1">Llamados a la acción</h2><p class="mb-0 text-muted">¿Necesitas una recomendación? Escríbenos y te ayudamos a elegir lo mejor.</p></div>',
                '      <div class="col-md-4 text-md-end"><a class="btn btn-success me-2" href="carrito.html">Ir al carrito</a><a class="btn btn-outline-primary" href="contacto.html">Contáctanos</a></div>',
                '    </div>',
                '  </section>',
                '',
                '  <h2 id="productos" class="h4 text-center mb-3">Productos</h2>',
                '',
                '  <div class="row" ng-if="$ctrl.cargando"><div class="col-12"><div class="alert alert-info">Cargando productos…</div></div></div>',
                '  <div class="row" ng-if="!$ctrl.cargando && $ctrl.error"><div class="col-12"><div class="alert alert-warning">{{$ctrl.error}}</div></div></div>',
                '',
                '  <div class="row g-3" ng-if="!$ctrl.cargando && !$ctrl.error">',
                '    <div class="col-md-4" ng-repeat="p in $ctrl.productos track by ($index)">',
                '      <producto-card producto="p" es-favorito="$ctrl.esFavorito(p)" on-add-cart="$ctrl.agregarCarrito(producto)" on-toggle-fav="$ctrl.toggleFav(producto)" on-ver-mas="$ctrl.verMas(producto)"></producto-card>',
                '    </div>',
                '  </div>',
                '</div>',
                '',
                '<div class="modal fade" id="modalVerMas" tabindex="-1" aria-hidden="true">',
                '  <div class="modal-dialog modal-dialog-centered">',
                '    <div class="modal-content">',
                '      <div class="modal-header">',
                '        <h5 class="modal-title">{{$ctrl.seleccionado.nombre || \'Detalle del producto\'}}</h5>',
                '        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>',
                '      </div>',
                '      <div class="modal-body" ng-if="$ctrl.seleccionado">',
                '        <img class="img-fluid rounded mb-3" ng-src="{{ $ctrl.seleccionado.imagen }}" alt="{{ $ctrl.seleccionado.nombre }}">',
                '        <p class="mb-2"><strong>Precio:</strong> ${{$ctrl.seleccionado.precio || \'—\'}}</p>',
                '        <p class="mb-0 text-muted">Información adicional de demostración.</p>',
                '      </div>',
                '      <div class="modal-footer">',
                '        <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cerrar</button>',
                '        <button type="button" class="btn btn-primary" ng-click="$ctrl.agregarCarrito($ctrl.seleccionado)">Agregar al carrito</button>',
                '      </div>',
                '    </div>',
                '  </div>',
                '</div>',
                '',
                '<footer class="mt-5 py-4 border-top bg-white">',
                '  <div class="container">',
                '    <div class="row g-3 align-items-center">',
                '      <div class="col-md-8"><div class="fw-semibold">Tienda de Mascotas</div><div class="text-muted small">Atención: Lun–Sáb 9:00–18:00 · Envíos locales · Pagos seguros</div></div>',
                '      <div class="col-md-4 text-md-end"><a class="btn btn-sm btn-outline-secondary me-2" href="contacto.html">Contacto</a><a class="btn btn-sm btn-outline-danger" href="favoritos.html">Favoritos</a></div>',
                '    </div>',
                '  </div>',
                '</footer>',
            ]),
        })
        .component('contactoPage', {
            controller: function () {
                var vm = this;
                vm.form = {
                    nombre: '',
                    email: '',
                    telefono: '',
                    mensaje: '',
                    acepto: false,
                };
                vm.enviado = false;

                vm.enviar = function (formContacto) {
                    vm.enviado = false;
                    if (!formContacto || formContacto.$invalid) return;
                    vm.enviado = true;
                    vm.resumen = {
                        nombre: vm.form.nombre,
                        email: vm.form.email,
                    };
                    vm.form = {
                        nombre: '',
                        email: '',
                        telefono: '',
                        mensaje: '',
                        acepto: false,
                    };
                    formContacto.$setPristine();
                    formContacto.$setUntouched();
                };

                vm.telValido = function () {
                    var v = String(vm.form.telefono || '').replace(/^\s+|\s+$/g, '');
                    if (!v) return true;
                    return /^[\d\s+\-()]{7,20}$/.test(v);
                };
            },
            template: tpl([
                '<div class="container py-4">',
                '  <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">',
                '    <a href="index.html" class="btn btn-outline-secondary btn-sm">← Inicio</a>',
                '    <span class="text-muted">Tienda de Mascotas</span>',
                '  </div>',
                '',
                '  <div class="row justify-content-center">',
                '    <div class="col-lg-8">',
                '      <div class="card shadow">',
                '        <div class="card-body p-4">',
                '          <h1 class="h3 mb-4 text-center">Escríbenos</h1>',
                '          <p class="text-muted small mb-4">Los campos marcados con <span class="text-danger">*</span> son obligatorios.</p>',
                '',
                '          <div class="alert alert-success" role="alert" ng-if="$ctrl.enviado">',
                '            <div class="fw-semibold">¡Gracias! Tu mensaje fue enviado.</div>',
                '            <div class="small text-muted mt-1">Confirmación de demostración: {{$ctrl.resumen.nombre}} ({{$ctrl.resumen.email}})</div>',
                '          </div>',
                '',
                '          <form name="formContacto" novalidate ng-submit="$ctrl.enviar(formContacto)">',
                '            <div class="mb-3">',
                '              <label class="form-label">Nombre completo <span class="text-danger">*</span></label>',
                '              <input type="text" class="form-control" name="nombre" ng-model="$ctrl.form.nombre" required ng-minlength="2" ng-maxlength="120" autocomplete="name" placeholder="Tu nombre">',
                '              <div class="text-danger small mt-1" ng-if="formContacto.nombre.$touched && formContacto.nombre.$invalid">Indica un nombre de al menos 2 caracteres.</div>',
                '            </div>',
                '',
                '            <div class="mb-3">',
                '              <label class="form-label">Correo electrónico <span class="text-danger">*</span></label>',
                '              <input type="email" class="form-control" name="email" ng-model="$ctrl.form.email" required autocomplete="email" placeholder="correo@ejemplo.com">',
                '              <div class="text-danger small mt-1" ng-if="formContacto.email.$touched && formContacto.email.$invalid">Introduce un correo electrónico válido.</div>',
                '            </div>',
                '',
                '            <div class="mb-3">',
                '              <label class="form-label">Teléfono</label>',
                '              <input type="text" class="form-control" name="telefono" ng-model="$ctrl.form.telefono" ng-change="formContacto.telefono.$setValidity(\'tel\', $ctrl.telValido())" inputmode="tel" maxlength="20" placeholder="Opcional, ej. +57 300 1234567">',
                '              <div class="text-danger small mt-1" ng-if="formContacto.telefono.$touched && formContacto.telefono.$error.tel">Teléfono: solo números, espacios y + - ( ), entre 7 y 20 caracteres.</div>',
                '            </div>',
                '',
                '            <div class="mb-3">',
                '              <label class="form-label">Mensaje <span class="text-danger">*</span></label>',
                '              <textarea class="form-control" name="mensaje" ng-model="$ctrl.form.mensaje" rows="4" required ng-minlength="10" ng-maxlength="2000" placeholder="¿En qué podemos ayudarte?"></textarea>',
                '              <div class="text-danger small mt-1" ng-if="formContacto.mensaje.$touched && formContacto.mensaje.$invalid">El mensaje debe tener al menos 10 caracteres.</div>',
                '            </div>',
                '',
                '            <div class="mb-4 form-check">',
                '              <input type="checkbox" class="form-check-input" id="acepto" name="acepto" ng-model="$ctrl.form.acepto" required>',
                '              <label class="form-check-label" for="acepto">Acepto la política de privacidad y el tratamiento de datos <span class="text-danger">*</span></label>',
                '              <div class="text-danger small mt-1" ng-if="formContacto.acepto.$touched && formContacto.acepto.$invalid">Debes aceptar para continuar.</div>',
                '            </div>',
                '',
                '            <div class="d-grid gap-2 d-sm-flex justify-content-sm-end">',
                '              <a href="index.html" class="btn btn-outline-secondary order-sm-1">Cancelar</a>',
                '              <button type="submit" class="btn btn-primary order-sm-2" ng-disabled="formContacto.$invalid">Enviar</button>',
                '            </div>',
                '          </form>',
                '        </div>',
                '      </div>',
                '    </div>',
                '  </div>',
                '</div>',
            ]),
        });
})();


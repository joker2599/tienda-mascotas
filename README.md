## Tienda de Mascotas (Frontend + API)

Aplicación web simple para mostrar un catálogo de productos para mascotas, con carrito y favoritos usando `localStorage`, una página de contacto con validaciones y un backend (o API serverless en Vercel) que entrega productos.

### URL (Vercel)
### URL GIT (https://github.com/joker2599/tienda-mascotas.git)

- **Sitio (alias estable)**: `https://tienda-mascotas-pi.vercel.app`

> Vercel también crea URLs “con hash” por cada despliegue (por ejemplo `https://tienda-mascotas-xxxxx.vercel.app`).  
> Esas cambian en cada deploy; la que debes documentar es el **alias estable** de arriba.

---

## Cómo funciona

### Frontend

- **Tecnología**: HTML + Bootstrap + **AngularJS 1.8 (CDN)**.
- **Páginas**:
  - `index.html`: Home con bienvenida, servicios destacados, call-to-action, footer y listado de productos en cards.
  - `contacto.html`: formulario con validaciones (obligatorios, email válido, teléfono opcional con formato básico) y mensaje de confirmación.
  - `frontend/carrito.html`: muestra carrito (persistido en `localStorage`).
  - `frontend/favoritos.html`: lista favoritos (persistido en `localStorage`).
- **Lógica AngularJS**:
  - `frontend/js/ng-app.js`
    - Componente `homePage`: carga productos desde la API y renderiza cards.
    - Componente `productoCard`: card del producto con **“Ver más”** (modal) y acciones de carrito/favoritos.
    - Componente `contactoPage`: form con binding y validaciones + confirmación.
- **Persistencia local**:
  - Carrito: `localStorage["carrito"]`
  - Favoritos: `localStorage["favoritos"]`

### Imágenes

- Se sirven como archivos estáticos desde `frontend/img/`.
- Los productos usan rutas tipo `img/concentrado.jpg` (relativas al sitio).

### API / Productos

Hay 2 maneras (local y Vercel):

#### 1) Local (Node/Express)

- Servidor: `backend/server.js`
- Ruta: `GET http://localhost:3000/api/productos`
- Si existe `MONGO_URI`, intenta conectar a MongoDB y leer desde la colección `productos`.
- Si **no hay Mongo**, el endpoint responde un catálogo **demo** (para que el frontend funcione igual).

#### 2) Vercel (Serverless)

- Función: `api/productos.js`
- Ruta: `GET /api/productos`
- Comportamiento:
  - Si Vercel tiene `MONGO_URI` configurado → lee de MongoDB.
  - Si no → responde catálogo **demo**.

---

## Ejecutar en local

### Requisitos

- Node.js

### 1) Instalar dependencias

```bash
npm install
```

### 2) Levantar backend (API local)

```bash
node backend/server.js
```

API: `http://localhost:3000/api/productos`

### 3) Servir el frontend

```bash
npx --yes http-server frontend -p 5173 -c-1
```

Abrir:
- `http://127.0.0.1:5173/index.html`
- `http://127.0.0.1:5173/contacto.html`

---

## Despliegue en Vercel

1.  se importa el repositorio en Vercel.
2. (Opcional) Configura variable de entorno **`MONGO_URI`** si quieres usar base de datos real.
3. Deploy.

### Rutas en producción

- Home: `/`
- Contacto: `/contacto.html`
- API: `/api/productos`
- Estáticos:
  - `/img/...` (imágenes)
  - `/frontend/js/...` (scripts)

El archivo `vercel.json` contiene los rewrites para servir los archivos desde `frontend/` y la raíz.

---

## Pregunta: “¿tiene que estar conectado MongoDB Compass para que muestre las imágenes?”

**No.**

- **MongoDB Compass es solo una herramienta de administración**, no es necesaria para que el sitio muestre imágenes.
- Las **imágenes se cargan desde `frontend/img/`** (estáticos) y Vercel las sirve igual.
- MongoDB solo afecta **de dónde vienen los productos** (BD real vs catálogo demo).  
  Si no hay Mongo, igual verás productos e imágenes (modo demo).


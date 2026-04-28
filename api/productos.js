const mongoose = require('mongoose');
const Producto = require('../backend/models/producto');

const DEMO_PRODUCTOS = [
    { nombre: 'Concentrado premium', precio: 45000, imagen: 'img/concentrado.jpg' },
    { nombre: 'Cama acolchada', precio: 60000, imagen: 'img/cama.jpg' },
    { nombre: 'Juguete resistente', precio: 18000, imagen: 'img/juguete.jpg' },
    { nombre: 'Servicio de veterinaria', precio: 80000, imagen: 'img/doctor.jpg' },
    { nombre: 'Peluquería canina', precio: 55000, imagen: 'img/peluqueria.jpg' },
    { nombre: 'Accesorios varios', precio: 25000, imagen: 'img/varios.jpg' },
];

let connPromise = null;

async function ensureMongo() {
    const uri = process.env.MONGO_URI;
    if (!uri) return false;

    if (mongoose.connection.readyState === 1) return true;
    if (!connPromise) {
        connPromise = mongoose
            .connect(uri, { serverSelectionTimeoutMS: 10000 })
            .catch((err) => {
                connPromise = null;
                throw err;
            });
    }
    await connPromise;
    return mongoose.connection.readyState === 1;
}

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(204).end();

    try {
        const conectado = await ensureMongo();

        if (req.method === 'GET') {
            if (!conectado) return res.status(200).json(DEMO_PRODUCTOS);
            const productos = await Producto.find();
            return res.status(200).json(productos);
        }

        // Para este proyecto, el frontend solo usa GET.
        // De todos modos, si hay BD se habilitan operaciones básicas.
        if (!conectado) {
            return res
                .status(503)
                .json({ error: 'Sin BD (MONGO_URI). Escritura deshabilitada.' });
        }

        if (req.method === 'POST') {
            const nuevo = new Producto(req.body || {});
            await nuevo.save();
            return res.status(200).json(nuevo);
        }

        // PUT/DELETE: Vercel no expone params estilo Express; usar query ?id=
        const id = req.query && req.query.id;
        if (!id) return res.status(400).json({ error: 'Falta query param: id' });

        if (req.method === 'PUT') {
            const updated = await Producto.findByIdAndUpdate(id, req.body || {}, {
                new: true,
            });
            return res.status(200).json(updated);
        }

        if (req.method === 'DELETE') {
            await Producto.findByIdAndDelete(id);
            return res.status(200).json({ mensaje: 'Producto eliminado' });
        }

        return res.status(405).json({ error: 'Método no permitido' });
    } catch (error) {
        return res.status(500).json({ error: error.message || 'Error interno' });
    }
};


const express = require('express');
const router = express.Router();
const Producto = require('../models/Producto');

const DEMO_PRODUCTOS = [
    {
        nombre: 'Concentrado premium',
        precio: 45000,
        imagen: 'img/concentrado.jpg',
    },
    {
        nombre: 'Cama acolchada',
        precio: 60000,
        imagen: 'img/cama.jpg',
    },
    {
        nombre: 'Juguete resistente',
        precio: 18000,
        imagen: 'img/juguete.jpg',
    },
    {
        nombre: 'Servicio de veterinaria',
        precio: 80000,
        imagen: 'img/doctor.jpg',
    },
    {
        nombre: 'Peluquería canina',
        precio: 55000,
        imagen: 'img/peluqueria.jpg',
    },
    {
        nombre: 'Accesorios varios',
        precio: 25000,
        imagen: 'img/varios.jpg',
    },
];


router.get('/', async (req, res) => {
    try {
        if (!Producto?.db?.readyState) {
            return res.json(DEMO_PRODUCTOS);
        }
        const productos = await Producto.find();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.post('/', async (req, res) => {
    try {
        if (!Producto?.db?.readyState) {
            return res
                .status(503)
                .json({ error: 'Modo demo: escritura deshabilitada (sin BD).' });
        }
        const nuevo = new Producto(req.body);
        await nuevo.save();
        res.json(nuevo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.put('/:id', async (req, res) => {
    try {
        if (!Producto?.db?.readyState) {
            return res
                .status(503)
                .json({ error: 'Modo demo: edición deshabilitada (sin BD).' });
        }
        const productoActualizado = await Producto.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(productoActualizado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.delete('/:id', async (req, res) => {
    try {
        if (!Producto?.db?.readyState) {
            return res
                .status(503)
                .json({ error: 'Modo demo: eliminación deshabilitada (sin BD).' });
        }
        await Producto.findByIdAndDelete(req.params.id);
        res.json({ mensaje: "Producto eliminado" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
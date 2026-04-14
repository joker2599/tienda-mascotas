const mongoose = require('mongoose');

const ProductoSchema = new mongoose.Schema({
    nombre: String,
    precio: Number,
    imagen: String,
    categoria: String,
    descuento: String
});

module.exports = mongoose.model('Producto', ProductoSchema);
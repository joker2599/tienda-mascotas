require('dotenv').config();

const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Debug
console.log('MONGO_URI:', process.env.MONGO_URI);

// Conexión MongoDB
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 10000,
  family: 4
})
.then(() => console.log('✅ MongoDB conectado'))
.catch(err => console.error('❌ Error:', err.message));

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('API funcionando 🚀');
});

// 👇 IMPORTANTE: esto mantiene vivo el servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log('🚀 Servidor corriendo en puerto ' + PORT);
});

const productosRoutes = require('./routes/productos');
app.use('/api/productos', productosRoutes);
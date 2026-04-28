require('dotenv').config();

const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();


app.use(cors());
app.use(express.json());

console.log('MONGO_URI:', process.env.MONGO_URI);

if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
    family: 4
  })
  .then(() => console.log(' MongoDB conectado'))
  .catch(err => console.error(' Error:', err.message));
} else {
  console.warn(' ⚠️  MONGO_URI no definido. Usando modo demo (sin BD).');
}


app.get('/', (req, res) => {
    res.send('API funcionando ');
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(' Servidor corriendo en puerto ' + PORT);
});

const productosRoutes = require('./routes/productos');
app.use('/api/productos', productosRoutes);
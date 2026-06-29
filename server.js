require('dotenv').config();
const express = require('express');
const { connectDB } = require('./src/config/database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
const authRoutes = require('./src/routes/auth.routes');
app.use('/api/auth', authRoutes);

const usuariosRoutes = require('./src/routes/usuarios.routes');
app.use('/api/usuarios', usuariosRoutes);

const zonasRoutes = require('./src/routes/zonas.routes');
app.use('/api/zonas', zonasRoutes);

const sucursalesRoutes = require('./src/routes/sucursales.routes');
app.use('/api/sucursales', sucursalesRoutes);

const productosRoutes = require('./src/routes/productos.routes');
app.use('/api/productos', productosRoutes);

const inventarioRoutes = require('./src/routes/inventario.routes');
app.use('/api/inventario', inventarioRoutes);

app.get('/', (req, res) => {
  res.json({ success: true, message: 'SmartMargin API v1.0' });
});
const start = async () => {
await connectDB();
app.listen(PORT, () => {
console.log(`Servidor en puerto ${PORT}`);
});
};
start();
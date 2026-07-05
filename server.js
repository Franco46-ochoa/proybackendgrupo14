require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { connectDB } = require('./src/config/database');
const csrfMiddleware = require('./src/middlewares/csrf');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', csrfMiddleware);

app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken || req.cookies?.['XSRF-TOKEN'] || null });
});

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

const transaccionesRoutes = require('./src/routes/transacciones.routes');
app.use('/api/transacciones', transaccionesRoutes);

const gastosRoutes = require('./src/routes/gastos.routes');
app.use('/api/gastos', gastosRoutes);

const proveedoresRoutes = require('./src/routes/proveedores.routes');
app.use('/api/proveedores', proveedoresRoutes);

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
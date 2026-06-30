require("dotenv").config();
const express = require("express");
const { connectDB } = require("./src/config/database");
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Rutas
const authRoutes = require("./src/routes/auth.routes");
const usuariosRoutes = require("./src/routes/usuarios.routes");
const zonasRoutes = require("./src/routes/zonas.routes");
const sucursalesRoutes = require("./src/routes/sucursales.routes");
const productosRoutes = require("./src/routes/productos.routes");
const inventarioRoutes = require("./src/routes/inventario.routes");
const transaccionesRoutes = require("./src/routes/transacciones.routes");
const gastosRoutes = require("./src/routes/gastos.routes");
const proveedoresRoutes = require("./src/routes/proveedores.routes");
const reportesRoutes = require("./src/routes/reportes.routes");
app.use("/api/auth", authRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/zonas", zonasRoutes);
app.use("/api/sucursales", sucursalesRoutes);
app.use("/api/productos", productosRoutes);
app.use("/api/inventario", inventarioRoutes);
app.use("/api/transacciones", transaccionesRoutes);
app.use("/api/gastos", gastosRoutes);
app.use("/api/proveedores", proveedoresRoutes);
app.use("/api/reportes", reportesRoutes);
app.get("/", (req, res) => {
  res.json({ success: true, message: "SmartMargin API v1.0" });
});
const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Servidor en puerto ${PORT}`);
  });
};
start();
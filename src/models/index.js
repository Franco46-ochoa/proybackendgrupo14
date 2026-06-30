const { sequelize } = require('../config/database');
const Usuario = require('./Usuario')(sequelize);
const Zona = require('./Zona')(sequelize);
const Sucursal = require('./Sucursal')(sequelize);
const Suscripcion = require('./Suscripcion')(sequelize);
const Auditoria = require('./Auditoria')(sequelize);
const ReporteAgente = require('./ReporteAgente')(sequelize);
const Producto = require('./Producto')(sequelize);
const Inventario = require('./Inventario')(sequelize);
const Transaccion = require('./Transaccion')(sequelize);
const Gasto = require('./Gasto')(sequelize);
const Proveedor = require('./Proveedor')(sequelize);
const CodigoInvitacion = require('./CodigoInvitacion')(sequelize);

// ─── Zona → Sucursal (1:N) ───
Zona.hasMany(Sucursal, { foreignKey: 'zonaId', as: 'sucursales' });
Sucursal.belongsTo(Zona, { foreignKey: 'zonaId', as: 'zona' });

// ─── Usuario → Zona (1:N, dueño de la zona) ───
Usuario.hasMany(Zona, { foreignKey: 'duenoId', as: 'zonasPropias' });
Zona.belongsTo(Usuario, { foreignKey: 'duenoId', as: 'dueño' });

// ─── Zona → Usuario (1:N) ───
Zona.hasMany(Usuario, { foreignKey: 'zonaId', as: 'usuarios' });
Usuario.belongsTo(Zona, { foreignKey: 'zonaId', as: 'zona' });

// ─── Sucursal → Usuario (1:N) ───
Sucursal.hasMany(Usuario, { foreignKey: 'sucursalId', as: 'usuarios' });
Usuario.belongsTo(Sucursal, { foreignKey: 'sucursalId', as: 'sucursal' });

// ─── Usuario → Suscripcion (1:1) ───
Usuario.hasOne(Suscripcion, { foreignKey: 'usuarioId', as: 'suscripcion' });
Suscripcion.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' });

// ─── Usuario → Auditoria (1:N) ───
Usuario.hasMany(Auditoria, { foreignKey: 'usuarioId', as: 'auditorias' });
Auditoria.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' });

// ─── Sucursal → ReporteAgente (1:N) ───
Sucursal.hasMany(ReporteAgente, { foreignKey: 'sucursalId', as: 'reportes' });
ReporteAgente.belongsTo(Sucursal, { foreignKey: 'sucursalId', as: 'sucursal' });

// ─── Zona → ReporteAgente (1:N) ───
Zona.hasMany(ReporteAgente, { foreignKey: 'zonaId', as: 'reportes' });
ReporteAgente.belongsTo(Zona, { foreignKey: 'zonaId', as: 'zona' });

// ─── Usuario → ReporteAgente (1:N, quien genero el reporte) ───
Usuario.hasMany(ReporteAgente, { foreignKey: 'generadoPor', as: 'reportesGenerados' });
ReporteAgente.belongsTo(Usuario, { foreignKey: 'generadoPor', as: 'generador' });

// ─── Producto → Inventario (1:N) ───
Producto.hasMany(Inventario, { foreignKey: 'productoId', as: 'inventario' });
Inventario.belongsTo(Producto, { foreignKey: 'productoId', as: 'producto' });

// ─── Sucursal → Inventario (1:N) ───
Sucursal.hasMany(Inventario, { foreignKey: 'sucursalId', as: 'inventario' });
Inventario.belongsTo(Sucursal, { foreignKey: 'sucursalId', as: 'sucursal' });

// ─── Producto → Transaccion (1:N) ───
Producto.hasMany(Transaccion, { foreignKey: 'productoId', as: 'transacciones' });
Transaccion.belongsTo(Producto, { foreignKey: 'productoId', as: 'producto' });

// ─── Sucursal → Transaccion (1:N) ───
Sucursal.hasMany(Transaccion, { foreignKey: 'sucursalId', as: 'transacciones' });
Transaccion.belongsTo(Sucursal, { foreignKey: 'sucursalId', as: 'sucursal' });

// ─── Usuario → Transaccion (1:N) ───
Usuario.hasMany(Transaccion, { foreignKey: 'usuarioId', as: 'transacciones' });
Transaccion.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' });

// ─── Proveedor → Gasto (1:N) ───
Proveedor.hasMany(Gasto, { foreignKey: 'proveedorId', as: 'gastos' });
Gasto.belongsTo(Proveedor, { foreignKey: 'proveedorId', as: 'proveedor' });

// ─── Sucursal → Gasto (1:N) ───
Sucursal.hasMany(Gasto, { foreignKey: 'sucursalId', as: 'gastos' });
Gasto.belongsTo(Sucursal, { foreignKey: 'sucursalId', as: 'sucursal' });

// ─── Usuario → CodigoInvitacion (1:N) ───
Usuario.hasMany(CodigoInvitacion, { foreignKey: 'duenoId', as: 'codigos' });
CodigoInvitacion.belongsTo(Usuario, { foreignKey: 'duenoId', as: 'dueno' });

// ─── Sucursal → CodigoInvitacion (1:N) ───
Sucursal.hasMany(CodigoInvitacion, { foreignKey: 'sucursalId', as: 'codigos' });
CodigoInvitacion.belongsTo(Sucursal, { foreignKey: 'sucursalId', as: 'sucursal' });

module.exports = {
  sequelize,
  Usuario,
  Zona,
  Sucursal,
  Suscripcion,
  Auditoria,
  ReporteAgente,
  Producto,
  Inventario,
  Transaccion,
  Gasto,
  Proveedor,
  CodigoInvitacion,
};

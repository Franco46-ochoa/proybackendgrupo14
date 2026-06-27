const { sequelize } = require("../config/database");
const Usuario = require("./Usuario")(sequelize);
const Zona = require("./Zona")(sequelize);
const Sucursal = require("./Sucursal")(sequelize);
const Suscripcion = require("./Suscripcion")(sequelize);
const Auditoria = require("./Auditoria")(sequelize);
const ReporteAgente = require("./ReporteAgente")(sequelize);
// ─── Zona → Sucursal (1:N) ───
Zona.hasMany(Sucursal, {
  foreignKey: "zonaId",
  as: "sucursales",
});
Sucursal.belongsTo(Zona, {
  foreignKey: "zonaId",
  as: "zona",
});
// ─── Zona → Usuario (1:N) ───
Zona.hasMany(Usuario, {
  foreignKey: "zonaId",
  as: "usuarios",
});
Usuario.belongsTo(Zona, {
  foreignKey: "zonaId",
  as: "zona",
});
// ─── Sucursal → Usuario (1:N) ───
Sucursal.hasMany(Usuario, {
  foreignKey: "sucursalId",
  as: "usuarios",
});
Usuario.belongsTo(Sucursal, {
  foreignKey: "sucursalId",
  as: "sucursal",
});
// Usuario → Suscripcion (1:1)
Usuario.hasOne(Suscripcion, { foreignKey: "usuarioId", as: "suscripcion" });
Suscripcion.belongsTo(Usuario, { foreignKey: "usuarioId", as: "usuario" });
// Usuario → Auditoria (1:N)
Usuario.hasMany(Auditoria, { foreignKey: "usuarioId", as: "auditorias" });
Auditoria.belongsTo(Usuario, { foreignKey: "usuarioId", as: "usuario" });
// Sucursal → ReporteAgente (1:N)
Sucursal.hasMany(ReporteAgente, { foreignKey: "sucursalId", as: "reportes" });
ReporteAgente.belongsTo(Sucursal, { foreignKey: "sucursalId", as: "sucursal" });
// Zona → ReporteAgente (1:N)
Zona.hasMany(ReporteAgente, { foreignKey: "zonaId", as: "reportes" });
ReporteAgente.belongsTo(Zona, { foreignKey: "zonaId", as: "zona" });
// Usuario → ReporteAgente (1:N, quien genero el reporte)
Usuario.hasMany(ReporteAgente, {
  foreignKey: "generadoPor",
  as: "reportesGenerados",
});
ReporteAgente.belongsTo(Usuario, {
  foreignKey: "generadoPor",
  as: "generador",
});
module.exports = {
  sequelize,
  Usuario,
  Zona,
  Sucursal,
  Suscripcion,
  Auditoria,
  ReporteAgente,
};

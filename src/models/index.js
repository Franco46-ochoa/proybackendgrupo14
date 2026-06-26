const { sequelize } = require('../config/database');
const Usuario = require('./Usuario')(sequelize);
const Zona = require('./Zona')(sequelize);
const Sucursal = require('./Sucursal')(sequelize);
// ─── Zona → Sucursal (1:N) ───
Zona.hasMany(Sucursal, {
foreignKey: 'zonaId',
as: 'sucursales',
});
Sucursal.belongsTo(Zona, {
foreignKey: 'zonaId',
as: 'zona',
});
// ─── Zona → Usuario (1:N) ───
Zona.hasMany(Usuario, {
foreignKey: 'zonaId',
as: 'usuarios',
});
Usuario.belongsTo(Zona, {
foreignKey: 'zonaId',
as: 'zona',
});
// ─── Sucursal → Usuario (1:N) ───
Sucursal.hasMany(Usuario, {
foreignKey: 'sucursalId',
as: 'usuarios',
});
Usuario.belongsTo(Sucursal, {
foreignKey: 'sucursalId',
as: 'sucursal',
});
module.exports = { sequelize, Usuario, Zona, Sucursal };
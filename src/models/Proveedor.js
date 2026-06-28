const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Proveedor = sequelize.define('Proveedor', {
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    cuit: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    contacto: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  }, {
    tableName: 'proveedores',
    timestamps: true,
  });

  return Proveedor;
};

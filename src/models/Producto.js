const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Producto = sequelize.define('Producto', {
    nombre: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    precioUnitario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    unidadMedida: {
      type: DataTypes.STRING(30),
      defaultValue: 'unidad',
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {
    tableName: 'productos',
    timestamps: true,
  });

  return Producto;
};

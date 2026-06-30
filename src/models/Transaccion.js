const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Transaccion = sequelize.define('Transaccion', {
    tipo: {
      type: DataTypes.ENUM('venta', 'compra'),
      allowNull: false,
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    precioUnitario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    fecha: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'transacciones',
    timestamps: true,
  });

  return Transaccion;
};

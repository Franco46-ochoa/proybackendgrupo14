const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Inventario = sequelize.define('Inventario', {
    stockActual: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    stockMinimo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 5,
    },
    stockMaximo: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }, {
    tableName: 'inventario',
    timestamps: true,
  });

  return Inventario;
};

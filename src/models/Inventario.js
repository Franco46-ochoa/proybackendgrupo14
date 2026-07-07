const { DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  const Inventario = sequelize.define(
    "Inventario",
    {
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
      stockMaximo: { type: DataTypes.INTEGER, allowNull: true },
      precioVenta: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
    },
    { tableName: "inventario", timestamps: true },
  );
  return Inventario;
};

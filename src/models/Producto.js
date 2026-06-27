const { DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  const Producto = sequelize.define(
    "Producto",
    {
      nombre: { type: DataTypes.STRING(150), allowNull: false },
      codigo: { type: DataTypes.STRING(50), allowNull: false, unique: true },
      categoria: { type: DataTypes.STRING(100), allowNull: true },
      descripcion: { type: DataTypes.TEXT, allowNull: true },
      precioCompra: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      unidadMedida: { type: DataTypes.STRING(30), defaultValue: "unidad" },
      activo: { type: DataTypes.BOOLEAN, defaultValue: true },
    },
    { tableName: "productos", timestamps: true },
  );
  return Producto;
};

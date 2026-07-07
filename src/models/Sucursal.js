const { DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  const Sucursal = sequelize.define(
    "Sucursal",
    {
      nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      direccion: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      lat: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      lng: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      telefono: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
    },
    {
      tableName: "sucursales",
      timestamps: true,
    },
  );
  return Sucursal;
};

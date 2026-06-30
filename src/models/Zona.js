const { DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  const Zona = sequelize.define(
    "Zona",
    {
      nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: "zonas",
      timestamps: true,
    },
  );
  return Zona;
};

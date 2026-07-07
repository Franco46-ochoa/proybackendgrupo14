const { DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  const Suscripcion = sequelize.define(
    "Suscripcion",
    {
      plan: {
        type: DataTypes.ENUM("basico", "pro", "enterprise"),
        allowNull: false,
      },
      estado: {
        type: DataTypes.ENUM("activo", "pendiente", "cancelado"),
        defaultValue: "pendiente",
      },
      monto: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      mercadoPagoId: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
      },
      fechaPago: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "suscripciones",
      timestamps: true,
    },
  );
  return Suscripcion;
};

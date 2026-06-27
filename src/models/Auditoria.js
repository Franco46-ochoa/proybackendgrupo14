const { DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  const Auditoria = sequelize.define(
    "Auditoria",
    {
      accion: {
        type: DataTypes.ENUM("CREATE", "UPDATE", "DELETE", "LOGIN", "EXPORT"),
        allowNull: false,
      },
      entidad: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      entidadId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      datosAnteriores: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      datosNuevos: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
    },
    {
      tableName: "auditoria",
      timestamps: true,
    },
  );
  return Auditoria;
};

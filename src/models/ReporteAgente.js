const { DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  const ReporteAgente = sequelize.define(
    "ReporteAgente",
    {
      tipoAgente: {
        type: DataTypes.ENUM("sector", "zona", "central"),
        allowNull: false,
      },
      sector: {
        type: DataTypes.ENUM("ventas", "finanzas", "stock"),
        allowNull: true,
      },
      contenidoJSON: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      resumenNLP: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      fechaGeneracion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "reportes_agentes",
      timestamps: true,
    },
  );
  return ReporteAgente;
};

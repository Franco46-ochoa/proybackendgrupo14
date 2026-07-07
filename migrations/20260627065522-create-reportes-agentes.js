"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("reportes_agentes", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      tipoAgente: {
        type: Sequelize.ENUM("sector", "zona", "central"),
        allowNull: false,
      },
      sector: {
        type: Sequelize.ENUM("ventas", "finanzas", "stock"),
        allowNull: true,
      },
      contenidoJSON: { type: Sequelize.JSONB, allowNull: true },
      resumenNLP: { type: Sequelize.TEXT, allowNull: true },
      sucursalId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: "sucursales", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      zonaId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: "zonas", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      generadoPor: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "usuarios", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      fechaGeneracion: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};

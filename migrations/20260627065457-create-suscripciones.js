"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("suscripciones", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      plan: {
        type: Sequelize.ENUM("basico", "pro", "enterprise"),
        allowNull: false,
      },
      estado: {
        type: Sequelize.ENUM("activo", "pendiente", "cancelado"),
        defaultValue: "pendiente",
      },
      monto: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      mercadoPagoId: { type: Sequelize.STRING, allowNull: true, unique: true },
      usuarioId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: { model: "usuarios", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
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

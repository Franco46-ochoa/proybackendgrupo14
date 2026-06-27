"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("auditoria", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      accion: {
        type: Sequelize.ENUM("CREATE", "UPDATE", "DELETE", "LOGIN", "EXPORT"),
        allowNull: false,
      },
      entidad: { type: Sequelize.STRING(50), allowNull: false },
      entidadId: { type: Sequelize.INTEGER, allowNull: true },
      datosAnteriores: { type: Sequelize.JSONB, allowNull: true },
      datosNuevos: { type: Sequelize.JSONB, allowNull: true },
      usuarioId: {
        type: Sequelize.INTEGER,
        allowNull: false,
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

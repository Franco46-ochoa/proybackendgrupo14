"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn("usuarios", "duenoId", "empresaId");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameColumn("usuarios", "empresaId", "duenoId");
  },
};

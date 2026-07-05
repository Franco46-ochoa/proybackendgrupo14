'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn('zonas', 'duenoId', 'empresaId');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameColumn('zonas', 'empresaId', 'duenoId');
  }
};
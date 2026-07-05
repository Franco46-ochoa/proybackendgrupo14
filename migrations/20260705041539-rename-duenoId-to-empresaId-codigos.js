'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Confirmado nombre con guion bajo según pgAdmin
    await queryInterface.renameColumn('codigos_invitacion', 'duenoId', 'empresaId');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameColumn('codigos_invitacion', 'empresaId', 'duenoId');
  }
};
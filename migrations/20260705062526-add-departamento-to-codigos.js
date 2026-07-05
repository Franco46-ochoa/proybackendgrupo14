'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('codigos_invitacion', 'departamento', {
      type: Sequelize.ENUM('comercial', 'operativo'),
      allowNull: true, // El código de Admin no lleva departamento
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('codigos_invitacion', 'departamento');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_codigos_invitacion_departamento";');
  }
};
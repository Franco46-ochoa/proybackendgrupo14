'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('usuarios', 'departamento', {
      type: Sequelize.ENUM('comercial', 'operativo'),
      allowNull: true, // Queda en null para Dueño y Admin
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('usuarios', 'departamento');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_usuarios_departamento";');
  }
};
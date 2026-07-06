"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('usuarios', 'apellido', {
      type: Sequelize.STRING(100),
      allowNull: true,
    });

    await queryInterface.sequelize.query(
      'UPDATE "usuarios" SET "apellido" = CASE WHEN COALESCE("apellido", \'\') = \'\' THEN \'\' ELSE "apellido" END WHERE "apellido" IS NULL;'
    );

    await queryInterface.changeColumn('usuarios', 'apellido', {
      type: Sequelize.STRING(100),
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('usuarios', 'apellido');
  },
};

"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      "ALTER TYPE \"enum_codigos_invitacion_rol\" ADD VALUE 'administrador';"
    );
  },

  async down(queryInterface, Sequelize) {
    // PostgreSQL no permite quitar valores de un ENUM
  },
};

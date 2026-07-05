"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      "ALTER TYPE \"enum_usuarios_rol\" ADD VALUE 'administrador';"
    );
  },

  async down(queryInterface, Sequelize) {
    // PostgreSQL no permite quitar valores de un ENUM
    // En caso de rollback, se necesitaría recrear el tipo
  },
};

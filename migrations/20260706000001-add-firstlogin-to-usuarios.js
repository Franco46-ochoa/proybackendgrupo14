"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("usuarios", "firstLogin", {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    });
    await queryInterface.sequelize.query(
      'UPDATE usuarios SET "firstLogin" = false'
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("usuarios", "firstLogin");
  },
};

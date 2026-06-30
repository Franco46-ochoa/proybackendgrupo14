"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("zonas", [
      { nombre: "Zona Norte", createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Zona Sur", createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Zona Centro", createdAt: new Date(), updatedAt: new Date() },
    ]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('TRUNCATE TABLE "zonas" RESTART IDENTITY CASCADE');
  },
};

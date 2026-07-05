"use strict";
const { faker } = require("@faker-js/faker");
module.exports = {
  async up(queryInterface, Sequelize) {
    const proveedores = [];
    for (let i = 0; i < 8; i++) {
      proveedores.push({
        nombre: faker.company.name(),
        cuit: `20-${String(Math.floor(10000000 + Math.random() * 89999999))}-${String(Math.floor(1 + Math.random() * 9))}`,
        contacto: faker.person.fullName(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    await queryInterface.bulkInsert("proveedores", proveedores);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('TRUNCATE TABLE "proveedores" RESTART IDENTITY CASCADE');
  },
};

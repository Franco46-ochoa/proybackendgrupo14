"use strict";
const { faker } = require("@faker-js/faker");
module.exports = {
  async up(queryInterface, Sequelize) {
    const inventario = [];
    for (let productoId = 1; productoId <= 20; productoId++) {
      for (let sucursalId = 1; sucursalId <= 5; sucursalId++) {
        if (Math.random() > 0.5) {
          inventario.push({
            productoId,
            sucursalId,
            stockActual: faker.number.int({ min: 0, max: 100 }),
            stockMinimo: 5,
            stockMaximo: faker.number.int({ min: 50, max: 200 }),
            precioVenta: parseFloat(faker.commerce.price({ min: 65, max: 650 })),
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      }
    }
    await queryInterface.bulkInsert("inventario", inventario);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('TRUNCATE TABLE "inventario" RESTART IDENTITY CASCADE');
  },
};

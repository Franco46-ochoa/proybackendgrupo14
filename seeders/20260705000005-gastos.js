"use strict";
const { faker } = require("@faker-js/faker");
module.exports = {
  async up(queryInterface, Sequelize) {
    const tipos = ["Alquiler", "Servicios", "Sueldos", "Mantenimiento", "Impuestos"];
    const gastos = [];
    const inicio = new Date("2023-01-01");
    const fin = new Date("2026-07-01");
    for (let i = 0; i < 20; i++) {
      gastos.push({
        tipo: faker.helpers.arrayElement(tipos),
        monto: parseFloat(faker.commerce.price({ min: 1000, max: 50000 })),
        descripcion: faker.lorem.sentence(),
        fecha: faker.date.between({ from: inicio, to: fin }),
        anomalia: Math.random() < 0.05,
        proveedorId: faker.number.int({ min: 1, max: 8 }),
        sucursalId: faker.number.int({ min: 1, max: 5 }),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    await queryInterface.bulkInsert("gastos", gastos);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('TRUNCATE TABLE "gastos" RESTART IDENTITY CASCADE');
  },
};

"use strict";
const { faker } = require("@faker-js/faker");
module.exports = {
  async up(queryInterface, Sequelize) {
    const transacciones = [];
    const inicio = new Date("2023-01-01");
    const fin = new Date("2026-07-01");
    for (let i = 0; i < 50; i++) {
      const tipo = Math.random() < 0.6 ? "venta" : "compra";
      const cantidad = faker.number.int({ min: 1, max: 50 });
      const precioUnitario = parseFloat(faker.commerce.price({ min: 50, max: 500 }));
      transacciones.push({
        tipo,
        cantidad,
        precioUnitario,
        total: parseFloat((cantidad * precioUnitario).toFixed(2)),
        fecha: faker.date.between({ from: inicio, to: fin }),
        observaciones: faker.lorem.sentence(),
        productoId: faker.number.int({ min: 1, max: 20 }),
        sucursalId: faker.number.int({ min: 1, max: 5 }),
        usuarioId: faker.number.int({ min: 1, max: 3 }),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    await queryInterface.bulkInsert("transacciones", transacciones);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('TRUNCATE TABLE "transacciones" RESTART IDENTITY CASCADE');
  },
};

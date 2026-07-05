"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("suscripciones", [
      {
        usuarioId: 1,
        plan: "pro",
        estado: "activo",
        monto: 2500.00,
        mercadoPagoId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('TRUNCATE TABLE "suscripciones" RESTART IDENTITY CASCADE');
  },
};

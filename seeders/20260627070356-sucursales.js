"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("sucursales", [
      {
        nombre: "SmartMargin Norte",
        direccion: "Av. San Martin 1234",
        lat: -24.183,
        lng: -65.331,
        telefono: "388-4123456",
        zonaId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nombre: "SmartMargin Sur",
        direccion: "Calle Belgrano 567",
        lat: -24.195,
        lng: -65.3,
        telefono: "388-4234567",
        zonaId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nombre: "SmartMargin Centro",
        direccion: "Peatonal Lavalle 890",
        lat: -24.185,
        lng: -65.31,
        telefono: "388-4345678",
        zonaId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nombre: "SmartMargin Norte II",
        direccion: "Ruta 9 Km 15",
        lat: -24.16,
        lng: -65.35,
        telefono: "388-4456789",
        zonaId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nombre: "SmartMargin Sur II",
        direccion: "Av. Almirante Brown 200",
        lat: -24.21,
        lng: -65.29,
        telefono: "388-4567890",
        zonaId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('TRUNCATE TABLE "sucursales" RESTART IDENTITY CASCADE');
  },
};

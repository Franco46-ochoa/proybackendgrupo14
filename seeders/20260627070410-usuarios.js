"use strict";
const bcrypt = require("bcryptjs");
module.exports = {
  async up(queryInterface, Sequelize) {
    const hash = await bcrypt.hash("password123", 10);
    await queryInterface.bulkInsert("usuarios", [
      {
        nombre: "Franco",
        apellido: "Dueño",
        email: "dueno@smartmargin.com",
        password: hash,
        rol: "dueno",
        sector: null,
        zonaId: null,
        sucursalId: null,
        empresaId: null,
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nombre: "Admin",
        apellido: "SmartMargin",
        email: "admin@smartmargin.com",
        password: hash,
        rol: "administrador",
        sector: null,
        zonaId: null,
        sucursalId: null,
        empresaId: 1,
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nombre: "Gerente",
        apellido: "Norte",
        email: "gerente@smartmargin.com",
        password: hash,
        rol: "gerente",
        sector: null,
        zonaId: null,
        sucursalId: null,
        empresaId: 1,
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nombre: "Empleado",
        apellido: "Ventas",
        email: "empleado@smartmargin.com",
        password: hash,
        rol: "empleado",
        sector: "ventas",
        zonaId: null,
        sucursalId: null,
        empresaId: 1,
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('TRUNCATE TABLE "usuarios" RESTART IDENTITY CASCADE');
  },
};

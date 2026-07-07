"use strict";
const { faker } = require("@faker-js/faker");
module.exports = {
  async up(queryInterface, Sequelize) {
    const categorias = ["Electrónica", "Alimentos", "Bebidas", "Limpieza", "Snacks"];
    const unidades = ["unidad", "kg", "litro", "caja"];
    const productos = [];
    for (let i = 0; i < 20; i++) {
      productos.push({
        nombre: faker.commerce.productName(),
        codigo: `PRD-${String(i + 1).padStart(4, "0")}`,
        categoria: faker.helpers.arrayElement(categorias),
        descripcion: faker.commerce.productDescription(),
        precioCompra: parseFloat(faker.commerce.price({ min: 50, max: 500 })),
        unidadMedida: faker.helpers.arrayElement(unidades),
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    await queryInterface.bulkInsert("productos", productos);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('TRUNCATE TABLE "productos" RESTART IDENTITY CASCADE');
  },
};

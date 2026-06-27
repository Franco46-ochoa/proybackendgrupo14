'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('productos', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      nombre: { type: Sequelize.STRING(150), allowNull: false },
      codigo: { type: Sequelize.STRING(50), allowNull: false, unique: true },
      categoria: { type: Sequelize.STRING(100), allowNull: true },
      descripcion: { type: Sequelize.TEXT, allowNull: true },
      precioCompra: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      unidadMedida: { type: Sequelize.STRING(30), defaultValue: 'unidad' },
      activo: { type: Sequelize.BOOLEAN, defaultValue: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('productos');
  },
};
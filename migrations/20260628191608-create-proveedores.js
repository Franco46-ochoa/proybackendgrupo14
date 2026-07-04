'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('proveedores', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      nombre: { type: Sequelize.STRING(100), allowNull: false },
      cuit: { type: Sequelize.STRING(20), allowNull: false, unique: true },
      contacto: { type: Sequelize.STRING(100), allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('proveedores');
  },
};

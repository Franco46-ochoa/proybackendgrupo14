'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('inventario', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      stockActual: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      stockMinimo: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 5 },
      stockMaximo: { type: Sequelize.INTEGER, allowNull: true },
      precioVenta: { type: Sequelize.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
      productoId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'productos', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      sucursalId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'sucursales', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
    await queryInterface.addConstraint('inventario', {
      fields: ['productoId', 'sucursalId'],
      type: 'unique',
      name: 'unique_producto_sucursal',
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('inventario');
  },
};
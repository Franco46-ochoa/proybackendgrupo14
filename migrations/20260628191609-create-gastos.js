'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('gastos', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      tipo: { type: Sequelize.STRING, allowNull: false },
      monto: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      descripcion: { type: Sequelize.TEXT, allowNull: true },
      fecha: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      anomalia: { type: Sequelize.BOOLEAN, defaultValue: false },
      proveedorId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'proveedores', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      sucursalId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'sucursales', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('gastos');
  },
};

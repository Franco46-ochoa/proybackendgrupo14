"use strict";
const { faker } = require('@faker-js/faker');

module.exports = {
  async up(queryInterface, Sequelize) {
    const empresaId = 1;

    const zonas = [
      { nombre: 'Zona Norte', empresaId },
      { nombre: 'Zona Sur', empresaId },
      { nombre: 'Zona Centro', empresaId },
    ].map((zona) => ({ ...zona, createdAt: new Date(), updatedAt: new Date() }));

    await queryInterface.bulkInsert('zonas', zonas);

    const zonasDb = await queryInterface.sequelize.query(
      `SELECT id FROM zonas WHERE empresaId = :empresaId ORDER BY id`,
      { replacements: { empresaId }, type: Sequelize.QueryTypes.SELECT },
    );

    const sucursales = [];
    for (const zona of zonasDb) {
      for (let i = 1; i <= 3; i++) {
        sucursales.push({
          nombre: `Sucursal ${zona.id}-${i}`,
          direccion: faker.location.streetAddress(),
          lat: faker.location.latitude(-34, -22),
          lng: faker.location.longitude(-68, -58),
          telefono: faker.phone.number('3##-#######'),
          zonaId: zona.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }

    await queryInterface.bulkInsert('sucursales', sucursales);

    const productos = [];
    for (let i = 1; i <= 250; i++) {
      productos.push({
        nombre: faker.commerce.productName(),
        codigo: `P-${faker.string.alphanumeric(6).toUpperCase()}`,
        categoria: faker.commerce.department(),
        descripcion: faker.commerce.productDescription(),
        precioCompra: faker.finance.amount(100, 2500, 2),
        unidadMedida: faker.helpers.arrayElement(['unidad', 'kg', 'litro']),
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    await queryInterface.bulkInsert('productos', productos);

    const productosDb = await queryInterface.sequelize.query(
      'SELECT id FROM productos ORDER BY id',
      { type: Sequelize.QueryTypes.SELECT },
    );

    const inventario = [];
    const transacciones = [];
    const gastos = [];
    const proveedores = [];
    const codigos = [];
    const usuarios = [];

    const sucursalesDb = await queryInterface.sequelize.query(
      `SELECT id, zonaId FROM sucursales WHERE zonaId IN (:zonas)`,
      { replacements: { zonas: zonasDb.map((z) => z.id) }, type: Sequelize.QueryTypes.SELECT },
    );

    const proveedoresCount = 30;
    for (let i = 1; i <= proveedoresCount; i++) {
      proveedores.push({
        nombre: faker.company.name(),
        cuit: faker.string.numeric(11),
        contacto: faker.person.fullName(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    await queryInterface.bulkInsert('proveedores', proveedores);

    const proveedoresDb = await queryInterface.sequelize.query(
      'SELECT id FROM proveedores ORDER BY id',
      { type: Sequelize.QueryTypes.SELECT },
    );

    const empleados = [];
    const roles = [
      { rol: 'administrador', cantidad: 1 },
      { rol: 'gerente', cantidad: 5 },
      { rol: 'empleado', cantidad: 40 },
    ];

    usuarios.push({
      nombre: 'Franco',
      apellido: 'Dueño',
      email: 'dueno@smartmargin.com',
      password: '$2a$10$abcdefghijklmnopqrstuv',
      rol: 'dueno',
      empresaId: empresaId,
      activo: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    for (const rolDef of roles) {
      for (let i = 0; i < rolDef.cantidad; i++) {
        const departamento = rolDef.rol === 'empleado'
          ? faker.helpers.arrayElement(['comercial', 'operativo'])
          : null;

        usuarios.push({
          nombre: faker.person.firstName(),
          apellido: faker.person.lastName(),
          email: `${rolDef.rol}${i + 1}@smartmargin.com`,
          password: '$2a$10$abcdefghijklmnopqrstuv',
          rol: rolDef.rol,
          departamento,
          empresaId: empresaId,
          sucursalId: faker.helpers.arrayElement(sucursalesDb).id,
          zonaId: faker.helpers.arrayElement(zonasDb).id,
          activo: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }

    await queryInterface.bulkInsert('usuarios', usuarios);

    const usuariosDb = await queryInterface.sequelize.query(
      'SELECT id FROM usuarios WHERE empresaId = :empresaId ORDER BY id',
      { replacements: { empresaId }, type: Sequelize.QueryTypes.SELECT },
    );

    const zonasIds = zonasDb.map((z) => z.id);
    for (const sucursal of sucursalesDb) {
      for (let j = 0; j < 20; j++) {
        const producto = faker.helpers.arrayElement(productosDb);
        const stockActual = faker.number.int({ min: 0, max: 120 });
        const stockMinimo = faker.number.int({ min: 5, max: 20 });

        inventario.push({
          stockActual,
          stockMinimo,
          stockMaximo: stockMinimo + faker.number.int({ min: 10, max: 50 }),
          precioVenta: faker.finance.amount(150, 4500, 2),
          productoId: producto.id,
          sucursalId: sucursal.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }

    for (let i = 0; i < 2000; i++) {
      const producto = faker.helpers.arrayElement(productosDb);
      const sucursal = faker.helpers.arrayElement(sucursalesDb);
      const usuario = faker.helpers.arrayElement(usuariosDb);
      const tipo = faker.helpers.arrayElement(['venta', 'compra']);
      const cantidad = faker.number.int({ min: 1, max: 30 });
      const precioUnitario = faker.finance.amount(100, 5000, 2);
      const total = parseFloat(precioUnitario) * cantidad;

      transacciones.push({
        tipo,
        cantidad,
        precioUnitario,
        total,
        fecha: faker.date.past({ years: 2 }),
        observaciones: faker.lorem.sentence(),
        productoId: producto.id,
        sucursalId: sucursal.id,
        usuarioId: usuario.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    for (let i = 0; i < 300; i++) {
      const sucursal = faker.helpers.arrayElement(sucursalesDb);
      const proveedor = faker.helpers.arrayElement(proveedoresDb);

      gastos.push({
        tipo: faker.commerce.department(),
        monto: faker.finance.amount(1000, 100000, 2),
        descripcion: faker.lorem.sentence(),
        fecha: faker.date.past({ years: 2 }),
        anomalia: faker.datatype.boolean(0.1),
        proveedorId: proveedor.id,
        sucursalId: sucursal.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    for (let i = 0; i < 10; i++) {
      const rol = i < 3 ? 'gerente' : 'empleado';
      const sucursal = faker.helpers.arrayElement(sucursalesDb);
      const departamento = rol === 'empleado' ? faker.helpers.arrayElement(['comercial', 'operativo']) : null;

      codigos.push({
        codigo: `${rol === 'gerente' ? 'GER' : 'EMP'}-${faker.string.alphanumeric(6).toUpperCase()}`,
        rol,
        empresaId,
        sucursalId: sucursal.id,
        zonaId: sucursal.zonaId,
        departamento,
        usosMaximos: rol === 'gerente' ? 5 : 20,
        usosRealizados: 0,
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await queryInterface.bulkInsert('inventario', inventario);
    await queryInterface.bulkInsert('transacciones', transacciones);
    await queryInterface.bulkInsert('gastos', gastos);
    await queryInterface.bulkInsert('codigos_invitacion', codigos);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('TRUNCATE TABLE "codigos_invitacion" RESTART IDENTITY CASCADE');
    await queryInterface.sequelize.query('TRUNCATE TABLE "gastos" RESTART IDENTITY CASCADE');
    await queryInterface.sequelize.query('TRUNCATE TABLE "transacciones" RESTART IDENTITY CASCADE');
    await queryInterface.sequelize.query('TRUNCATE TABLE "inventario" RESTART IDENTITY CASCADE');
    await queryInterface.sequelize.query('TRUNCATE TABLE "productos" RESTART IDENTITY CASCADE');
    await queryInterface.sequelize.query('TRUNCATE TABLE "sucursales" RESTART IDENTITY CASCADE');
    await queryInterface.sequelize.query('TRUNCATE TABLE "zonas" RESTART IDENTITY CASCADE');
    await queryInterface.sequelize.query('TRUNCATE TABLE "usuarios" RESTART IDENTITY CASCADE');
    await queryInterface.sequelize.query('TRUNCATE TABLE "proveedores" RESTART IDENTITY CASCADE');
  },
};

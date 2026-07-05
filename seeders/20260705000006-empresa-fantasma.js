"use strict";
const { faker } = require("@faker-js/faker");
const bcrypt = require("bcryptjs");

module.exports = {
  async up(queryInterface, Sequelize) {
    const hash = await bcrypt.hash("password123", 10);
    const now = new Date();

    // ─── 1. DUEÑO ──────────────────────────────────────────
    const dueno = {
      nombre: "Dueño Empresa Fantasma",
      email: "dueno-fantasma@smartmargin.com",
      password: hash,
      rol: "dueno",
      sector: null,
      zonaId: null,
      sucursalId: null,
      activo: true,
      createdAt: now,
      updatedAt: now,
    };

    // ─── 2. ADMINISTRADOR ──────────────────────────────────
    const admin = {
      nombre: "Admin Fantasma",
      email: "admin-fantasma@smartmargin.com",
      password: hash,
      rol: "empleado",
      sector: null,
      zonaId: null,
      sucursalId: null,
      activo: true,
      createdAt: now,
      updatedAt: now,
    };

    // ─── 3. ZONAS ──────────────────────────────────────────
    const zonas = [
      { nombre: "Zona Norte Fantasma", createdAt: now, updatedAt: now },
      { nombre: "Zona Sur Fantasma", createdAt: now, updatedAt: now },
      { nombre: "Zona Centro Fantasma", createdAt: now, updatedAt: now },
    ];

    await queryInterface.bulkInsert("usuarios", [dueno, admin]);
    await queryInterface.bulkInsert("zonas", zonas);

    // IDs
    const [duenoRow] = await queryInterface.sequelize.query(
      'SELECT id FROM usuarios WHERE email = \'dueno-fantasma@smartmargin.com\''
    );
    const duenoId = duenoRow[0].id;

    const [zonaRows] = await queryInterface.sequelize.query(
      'SELECT id FROM zonas WHERE nombre LIKE \'%Fantasma%\' ORDER BY id'
    );
    const zonaIds = zonaRows.map((z) => z.id);

    // ─── 4. SUCURSALES (8) ────────────────────────────────
    const sucursales = [];
    const sucursalesNombres = [
      "SmartMargin Norte I", "SmartMargin Norte II",
      "SmartMargin Sur I", "SmartMargin Sur II",
      "SmartMargin Centro I", "SmartMargin Centro II",
      "SmartMargin Express Norte", "SmartMargin Express Sur",
    ];
    for (let i = 0; i < 8; i++) {
      sucursales.push({
        nombre: sucursalesNombres[i],
        direccion: faker.location.streetAddress(),
        lat: parseFloat(faker.location.latitude({ min: -24.25, max: -24.15 })),
        lng: parseFloat(faker.location.longitude({ min: -65.40, max: -65.25 })),
        telefono: `388-${faker.string.numeric(7)}`,
        zonaId: zonaIds[i % zonaIds.length],
        createdAt: now,
        updatedAt: now,
      });
    }
    await queryInterface.bulkInsert("sucursales", sucursales);

    const [sucursalRows] = await queryInterface.sequelize.query(
      'SELECT id FROM sucursales WHERE nombre LIKE \'%Fantasma%\' ORDER BY id'
    );
    const sucursalIds = sucursalRows.map((s) => s.id);

    // ─── 5. GERENTES (8) ──────────────────────────────────
    const gerentes = [];
    for (let i = 0; i < 8; i++) {
      gerentes.push({
        nombre: `Gerente ${i + 1} Fantasma`,
        email: `gerente${i + 1}-fantasma@smartmargin.com`,
        password: hash,
        rol: "gerente",
        sector: null,
        zonaId: zonaIds[i % zonaIds.length],
        sucursalId: sucursalIds[i],
        activo: true,
        createdAt: now,
        updatedAt: now,
      });
    }

    // ─── 6. EMPLEADOS (25: ~13 comercial, ~12 operativo) ──
    const empleados = [];
    for (let i = 0; i < 25; i++) {
      const isComercial = i < 13;
      empleados.push({
        nombre: `Empleado ${i + 1} Fantasma`,
        email: `empleado${i + 1}-fantasma@smartmargin.com`,
        password: hash,
        rol: "empleado",
        sector: isComercial ? "ventas" : "stock",
        zonaId: zonaIds[i % zonaIds.length],
        sucursalId: sucursalIds[i % sucursalIds.length],
        activo: true,
        createdAt: now,
        updatedAt: now,
      });
    }

    await queryInterface.bulkInsert("usuarios", [...gerentes, ...empleados]);

    // ─── 7. PROVEEDORES (25) ──────────────────────────────
    const proveedores = [];
    for (let i = 0; i < 25; i++) {
      proveedores.push({
        nombre: faker.company.name(),
        cuit: `30-${String(Math.floor(10000000 + Math.random() * 89999999))}-${String(Math.floor(1 + Math.random() * 9))}`,
        contacto: faker.person.fullName(),
        createdAt: now,
        updatedAt: now,
      });
    }
    await queryInterface.bulkInsert("proveedores", proveedores);

    const [proveedorRows] = await queryInterface.sequelize.query(
      'SELECT id FROM proveedores ORDER BY id DESC LIMIT 25'
    );
    const proveedorIds = proveedorRows.map((p) => p.id);

    // ─── 8. PRODUCTOS (300) ───────────────────────────────
    const categorias = ["Electrónica", "Alimentos", "Bebidas", "Limpieza", "Snacks", "Ropa", "Herramientas", "Deportes"];
    const unidades = ["unidad", "kg", "litro", "caja", "paquete"];
    const productos = [];
    for (let i = 0; i < 300; i++) {
      productos.push({
        nombre: faker.commerce.productName(),
        codigo: `FAN-PRD-${String(i + 1).padStart(4, "0")}`,
        categoria: faker.helpers.arrayElement(categorias),
        descripcion: faker.commerce.productDescription(),
        precioCompra: parseFloat(faker.commerce.price({ min: 50, max: 800 })),
        unidadMedida: faker.helpers.arrayElement(unidades),
        activo: true,
        createdAt: now,
        updatedAt: now,
      });
    }
    await queryInterface.bulkInsert("productos", productos);

    const [productoRows] = await queryInterface.sequelize.query(
      'SELECT id FROM productos WHERE codigo LIKE \'FAN-PRD-%\' ORDER BY id'
    );
    const productoIds = productoRows.map((p) => p.id);

    // ─── 9. INVENTARIO (~2000: producto × sucursal parcial) ─
    const inventario = [];
    for (const productoId of productoIds) {
      const numSucursales = faker.number.int({ min: 1, max: 3 });
      const sucursalesSeleccionadas = faker.helpers.arrayElements(sucursalIds, numSucursales);
      for (const sucursalId of sucursalesSeleccionadas) {
        inventario.push({
          productoId,
          sucursalId,
          stockActual: faker.number.int({ min: 0, max: 150 }),
          stockMinimo: faker.number.int({ min: 3, max: 15 }),
          stockMaximo: faker.number.int({ min: 50, max: 300 }),
          precioVenta: parseFloat(faker.commerce.price({ min: 65, max: 1200 })),
          createdAt: now,
          updatedAt: now,
        });
      }
    }
    // Insertar en lotes de 500 para no exceder límites
    for (let i = 0; i < inventario.length; i += 500) {
      await queryInterface.bulkInsert("inventario", inventario.slice(i, i + 500));
    }

    // ─── 10. TRANSACCIONES (4000) ─────────────────────────
    const transacciones = [];
    const inicio = new Date("2023-06-01");
    const fin = new Date("2026-07-01");
    const usuarioIds = [duenoId]; // todos los usuarios como posibles vendedores

    const [allUserRows] = await queryInterface.sequelize.query(
      'SELECT id FROM usuarios WHERE email LIKE \'%fantasma%\''
    );
    const allUserIds = allUserRows.map((u) => u.id);

    for (let i = 0; i < 4000; i++) {
      const tipo = Math.random() < 0.55 ? "venta" : "compra";
      const cantidad = faker.number.int({ min: 1, max: 80 });
      const precioUnitario = parseFloat(faker.commerce.price({ min: 50, max: 800 }));
      transacciones.push({
        tipo,
        cantidad,
        precioUnitario,
        total: parseFloat((cantidad * precioUnitario).toFixed(2)),
        fecha: faker.date.between({ from: inicio, to: fin }),
        observaciones: faker.lorem.sentence(),
        productoId: faker.helpers.arrayElement(productoIds),
        sucursalId: faker.helpers.arrayElement(sucursalIds),
        usuarioId: faker.helpers.arrayElement(allUserIds),
        createdAt: now,
        updatedAt: now,
      });
    }
    // Insertar en lotes de 1000
    for (let i = 0; i < transacciones.length; i += 1000) {
      await queryInterface.bulkInsert("transacciones", transacciones.slice(i, i + 1000));
    }

    // ─── 11. GASTOS (1500) ────────────────────────────────
    const tiposGasto = ["Alquiler", "Servicios", "Sueldos", "Mantenimiento", "Impuestos", "Marketing", "Transporte", "Seguros"];
    const gastos = [];
    for (let i = 0; i < 1500; i++) {
      gastos.push({
        tipo: faker.helpers.arrayElement(tiposGasto),
        monto: parseFloat(faker.commerce.price({ min: 500, max: 80000 })),
        descripcion: faker.lorem.sentence(),
        fecha: faker.date.between({ from: inicio, to: fin }),
        anomalia: Math.random() < 0.03,
        proveedorId: faker.helpers.arrayElement(proveedorIds),
        sucursalId: faker.helpers.arrayElement(sucursalIds),
        createdAt: now,
        updatedAt: now,
      });
    }
    // Insertar en lotes de 500
    for (let i = 0; i < gastos.length; i += 500) {
      await queryInterface.bulkInsert("gastos", gastos.slice(i, i + 500));
    }

    console.log("✅ Seeder Empresa Fantasma ejecutado:");
    console.log(`   - 1 Dueño, 1 Admin`);
    console.log(`   - 3 Zonas, 8 Sucursales`);
    console.log(`   - 8 Gerentes, 25 Empleados`);
    console.log(`   - 25 Proveedores, 300 Productos`);
    console.log(`   - ~${inventario.length} Inventario`);
    console.log(`   - 4,000 Transacciones`);
    console.log(`   - 1,500 Gastos`);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('TRUNCATE TABLE "gastos" RESTART IDENTITY CASCADE');
    await queryInterface.sequelize.query('TRUNCATE TABLE "transacciones" RESTART IDENTITY CASCADE');
    await queryInterface.sequelize.query('TRUNCATE TABLE "inventario" RESTART IDENTITY CASCADE');
    await queryInterface.sequelize.query('TRUNCATE TABLE "productos" RESTART IDENTITY CASCADE');
    await queryInterface.sequelize.query('TRUNCATE TABLE "proveedores" RESTART IDENTITY CASCADE');
    await queryInterface.sequelize.query(
      'DELETE FROM usuarios WHERE email LIKE \'%fantasma%\''
    );
    await queryInterface.sequelize.query(
      'DELETE FROM zonas WHERE nombre LIKE \'%Fantasma%\''
    );
    await queryInterface.sequelize.query(
      'DELETE FROM sucursales WHERE nombre LIKE \'%Fantasma%\''
    );
  },
};

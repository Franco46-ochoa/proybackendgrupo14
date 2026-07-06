require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const { test } = require('node:test');
const assert = require('node:assert');

const agenteStock = require('../src/agents/agenteStock');
const agenteVentas = require('../src/agents/agenteVentas');
const agenteFinanzas = require('../src/agents/agenteFinanzas');
const agenteZona = require('../src/agents/agenteZona');
const agenteCentral = require('../src/agents/agenteCentral');

test('agenteStock - con stock crítico genera contenidoJSON y resumenNLP', async () => {
  const datos = [
    { producto: 'Leche', stockActual: 12, stockMinimo: 20, precioCompra: 150, precioVenta: 210 },
    { producto: 'Pan', stockActual: 5, stockMinimo: 15, precioCompra: 100, precioVenta: 180 },
    { producto: 'Arroz', stockActual: 50, stockMinimo: 10, precioCompra: 80, precioVenta: 120 },
  ];

  const resultado = await agenteStock.ejecutar(datos);

  assert.ok(resultado.contenidoJSON, 'debe tener contenidoJSON');
  assert.strictEqual(resultado.contenidoJSON.totalProductos, 3);
  assert.strictEqual(resultado.contenidoJSON.stockCritico.length, 2);
  assert.ok(Array.isArray(resultado.contenidoJSON.stockCritico));
  assert.ok(resultado.resumenNLP, 'debe tener resumenNLP');
  assert.strictEqual(typeof resultado.resumenNLP, 'string');
  assert.ok(resultado.resumenNLP.length > 0);
});

test('agenteStock - sin stock crítico retorna array vacío y fallback mock', async () => {
  const datos = [
    { producto: 'Leche', stockActual: 50, stockMinimo: 20, precioCompra: 150, precioVenta: 210 },
    { producto: 'Pan', stockActual: 30, stockMinimo: 15, precioCompra: 100, precioVenta: 180 },
  ];

  const resultado = await agenteStock.ejecutar(datos);

  assert.ok(resultado.contenidoJSON);
  assert.strictEqual(resultado.contenidoJSON.stockCritico.length, 0);
  assert.ok(resultado.resumenNLP);
  assert.ok(resultado.resumenNLP.includes('adecuado') || resultado.resumenNLP.includes('stock'));
});

test('agenteVentas - calcula totalVentas, ticketPromedio y topProductos', async () => {
  const datos = [
    { producto: 'Leche', cantidad: 15, total: 3150, fecha: '2026-06-10' },
    { producto: 'Pan', cantidad: 20, total: 3600, fecha: '2026-06-11' },
    { producto: 'Leche', cantidad: 10, total: 2100, fecha: '2026-06-12' },
  ];

  const resultado = await agenteVentas.ejecutar(datos);

  assert.ok(resultado.contenidoJSON);
  assert.strictEqual(resultado.contenidoJSON.totalVentas, 8850);
  assert.strictEqual(resultado.contenidoJSON.cantidadVentas, 3);
  assert.strictEqual(resultado.contenidoJSON.ticketPromedio, 2950);
  assert.ok(Array.isArray(resultado.contenidoJSON.topProductos));
  assert.strictEqual(resultado.contenidoJSON.topProductos.length, 2);
  assert.ok(resultado.resumenNLP);
  assert.strictEqual(typeof resultado.resumenNLP, 'string');
});

test('agenteFinanzas - calcula totalGastos y detecta anomalías', async () => {
  const datos = [
    { tipo: 'Alquiler', monto: 45000, proveedor: 'Inmobiliaria Norte', fecha: '2026-06-05' },
    { tipo: 'Servicios', monto: 15000, proveedor: 'Edenor', fecha: '2026-06-06' },
    { tipo: 'Alquiler', monto: 45000, proveedor: 'Inmobiliaria Norte', fecha: '2026-06-07' },
  ];

  const resultado = await agenteFinanzas.ejecutar(datos);

  assert.ok(resultado.contenidoJSON);
  assert.strictEqual(resultado.contenidoJSON.totalGastos, 105000);
  assert.ok(resultado.contenidoJSON.gastosPorCategoria);
  assert.strictEqual(resultado.contenidoJSON.gastosPorCategoria['Alquiler'], 90000);
  assert.ok(Array.isArray(resultado.contenidoJSON.anomalias));
  assert.strictEqual(resultado.contenidoJSON.anomalias.length, 1);
  assert.strictEqual(resultado.contenidoJSON.anomalias[0].tipo, 'Alquiler');
  assert.ok(resultado.resumenNLP);
});

test('agenteZona - calcula margenZonal y ranking de sucursales', async () => {
  const datos = [
    { sucursal: 'Norte', ventas: 1200000, gastos: 500000, stockCritico: 2 },
    { sucursal: 'Sur', ventas: 800000, gastos: 600000, stockCritico: 5 },
  ];

  const resultado = await agenteZona.ejecutar(datos);

  assert.ok(resultado.contenidoJSON);
  assert.strictEqual(resultado.contenidoJSON.totalVentas, 2000000);
  assert.strictEqual(resultado.contenidoJSON.totalGastos, 1100000);
  assert.ok(resultado.contenidoJSON.margenZonal);
  assert.ok(Array.isArray(resultado.contenidoJSON.ranking));
  assert.strictEqual(resultado.contenidoJSON.ranking.length, 2);
  assert.ok(resultado.resumenNLP);
});

test('agenteCentral - calcula ingresosTotales, margen y stockCriticoGlobal', async () => {
  const datos = [
    { zona: 'Norte', ventas: 2200000, gastos: 900000, sucursales: 2, stockCritico: 3 },
    { zona: 'Sur', ventas: 1800000, gastos: 1200000, sucursales: 3, stockCritico: 5 },
  ];

  const resultado = await agenteCentral.ejecutar(datos);

  assert.ok(resultado.contenidoJSON);
  assert.strictEqual(resultado.contenidoJSON.ingresosTotales, 4000000);
  assert.strictEqual(resultado.contenidoJSON.gastosTotales, 2100000);
  assert.ok(resultado.contenidoJSON.margen);
  assert.strictEqual(resultado.contenidoJSON.stockCriticoGlobal, 8);
  assert.ok(Array.isArray(resultado.contenidoJSON.rankingZonas));
  assert.ok(resultado.resumenNLP);
});

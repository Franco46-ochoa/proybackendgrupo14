require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const { test } = require('node:test');
const assert = require('node:assert');
const path = require('path');

const orquestadorPath = path.resolve(__dirname, '../src/agents/orquestador.js');
require.cache[orquestadorPath] = {
  id: orquestadorPath,
  filename: orquestadorPath,
  loaded: true,
  exports: {
    orquestador: async ({ tipo }) => {
      if (tipo === 'sector') {
        return {
          stock: { contenidoJSON: { totalVentas: 100 }, resumenNLP: 'Stock con baja rotación' },
          ventas: { contenidoJSON: { totalVentas: 200 }, resumenNLP: 'Ventas estables' },
          finanzas: { contenidoJSON: { totalGastos: 150 }, resumenNLP: 'Gastos controlados' },
        };
      }
      if (tipo === 'zona') {
        return { contenidoJSON: { totalVentas: 500 }, resumenNLP: 'Zona con buen desempeño' };
      }
      return { contenidoJSON: { ingresosTotales: 1000 }, resumenNLP: 'Informe central generado' };
    },
  },
};

const { ReporteAgente } = require('../src/models');
const reporteController = require('../src/controllers/reporteController');

test('reporteController - genera y guarda un reporte central en BD', async () => {
  const created = [];
  const originalCreate = ReporteAgente.create;
  ReporteAgente.create = async (data) => {
    created.push(data);
    return data;
  };

  const req = { body: { tipo: 'central' }, usuario: { id: 1 } };
  let statusCode = 200;
  let jsonPayload = null;
  const res = {
    status(code) {
      statusCode = code;
      return this;
    },
    json(payload) {
      jsonPayload = payload;
      return this;
    },
  };

  await reporteController.generar(req, res);

  assert.strictEqual(statusCode, 200);
  assert.ok(jsonPayload.success);
  assert.strictEqual(created.length, 1);
  assert.strictEqual(created[0].tipoAgente, 'central');
  assert.deepStrictEqual(created[0].contenidoJSON, { ingresosTotales: 1000 });
  assert.strictEqual(created[0].resumenNLP, 'Informe central generado');
  assert.strictEqual(created[0].sucursalId, null);
  assert.strictEqual(created[0].zonaId, null);
  assert.strictEqual(created[0].generadoPor, 1);

  ReporteAgente.create = originalCreate;
});

test('reporteController - genera y guarda reportes de sector en BD', async () => {
  const created = [];
  const originalCreate = ReporteAgente.create;
  ReporteAgente.create = async (data) => {
    created.push(data);
    return data;
  };

  const req = { body: { tipo: 'sector', sucursalId: 10 }, usuario: { id: 2 } };
  let statusCode = 200;
  let jsonPayload = null;
  const res = {
    status(code) {
      statusCode = code;
      return this;
    },
    json(payload) {
      jsonPayload = payload;
      return this;
    },
  };

  await reporteController.generar(req, res);

  assert.strictEqual(statusCode, 200);
  assert.ok(jsonPayload.success);
  assert.strictEqual(created.length, 3);
  const sectores = created.map((item) => item.sector).sort();
  assert.deepStrictEqual(sectores, ['finanzas', 'stock', 'ventas']);
  assert.ok(created.every((item) => item.tipoAgente === 'sector'));
  assert.ok(created.every((item) => item.sucursalId === 10));
  assert.strictEqual(created[0].generadoPor, 2);

  ReporteAgente.create = originalCreate;
});

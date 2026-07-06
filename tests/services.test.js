require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const { test } = require('node:test');
const assert = require('node:assert');

const { generarContenido } = require('../src/services/gemini.service');
const { obtenerCotizacion } = require('../src/services/dolarAPI.service');

test('gemini.service - no lanza excepción con prompt simple', async () => {
  const prompt = 'Decí "Hola" en una palabra';
  const resultado = await generarContenido(prompt);

  assert.ok(resultado === null || typeof resultado === 'string', 'debe retornar null o string');
  if (resultado !== null) {
    assert.strictEqual(typeof resultado, 'string');
    assert.ok(resultado.length > 0, 'el resultado no debe estar vacío');
  }
});

test('dolarAPI.service - obtiene cotización del dólar blue', async () => {
  const resultado = await obtenerCotizacion();

  assert.ok(resultado, 'debe retornar un objeto');
  assert.strictEqual(typeof resultado, 'object');
  assert.ok(resultado.compra !== undefined, 'debe tener campo compra');
  assert.ok(resultado.venta !== undefined, 'debe tener campo venta');
  assert.strictEqual(typeof resultado.compra, 'number');
  assert.strictEqual(typeof resultado.venta, 'number');
  assert.ok(resultado.venta > 0, 'la venta debe ser mayor a 0');
});

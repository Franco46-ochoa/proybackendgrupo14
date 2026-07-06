const { generarContenido } = require('../services/gemini.service');

const ejecutar = async (datos) => {
  // datos = [{ producto: "Leche", stockActual: 12, stockMinimo: 20, precioCompra: 150, precioVenta: 210 }]
  const stockCritico = datos.filter((d) => d.stockActual < d.stockMinimo);
  const diasRestantes = stockCritico.map((item) => ({
    ...item,
    diasRestantes: Math.floor(item.stockActual / 5), // demanda diaria estimada = 5u
    recomendacion:
      item.stockActual < item.stockMinimo / 2 ? "URGENTE" : "Precaución",
  }));
  const contenidoJSON = {
    stockCritico: diasRestantes,
    totalProductos: datos.length,
  };

  // Intentar generar resumen con Gemini, fallback a mock
  let resumenNLP;
  try {
    if (stockCritico.length > 0) {
      const prompt = `Sos un analista de stock de SmartMargin AI. Analizá estos datos de inventario y generá un resumen ejecutivo en español (máximo 100 palabras):

Productos con stock crítico: ${stockCritico.length} de ${datos.length} totales.
Detalles: ${diasRestantes.slice(0, 5).map(d => `${d.producto} (${d.stockActual}u, mínimo ${d.stockMinimo}u, ${d.diasRestantes} días restantes)`).join('; ')}.

Incluí:
- Cuántos productos están en riesgo
- Cuáles son los más urgentes
- Recomendación de compra específica`;

      resumenNLP = await generarContenido(prompt);
    }
    
    if (!resumenNLP) {
      throw new Error('Gemini devolvió null o no hay stock crítico');
    }
  } catch (error) {
    console.warn('Gemini falló en agenteStock, usando fallback mock:', error.message);
    resumenNLP = stockCritico.length > 0
      ? `Se detectaron ${stockCritico.length} productos con stock crítico. ${diasRestantes
          .map(d => `${d.producto} (${d.stockActual}u, mínimo ${d.stockMinimo}u)`)
          .join(". ")}.`
      : "Todos los productos tienen stock adecuado.";
  }

  return { contenidoJSON, resumenNLP };
};
module.exports = { ejecutar };

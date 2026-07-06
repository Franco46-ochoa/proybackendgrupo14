const { generarContenido } = require('../services/gemini.service');

const ejecutar = async (datos) => {
  // datos = [{ zona: "Norte", ventas: 2200000, gastos: 900000, sucursales: 2, stockCritico: 3 }]
  const ingresosTotales = datos.reduce((s, d) => s + d.ventas, 0);
  const gastosTotales = datos.reduce((s, d) => s + d.gastos, 0);
  const margen = (
    ((ingresosTotales - gastosTotales) / ingresosTotales) *
    100
  ).toFixed(0);
  const stockCriticoGlobal = datos.reduce((s, d) => s + d.stockCritico, 0);

  const contenidoJSON = {
    ingresosTotales,
    gastosTotales,
    margen: `${margen}%`,
    stockCriticoGlobal,
    rankingZonas: datos,
  };

  // Intentar generar resumen con Gemini, fallback a mock
  let resumenNLP;
  try {
    const prompt = `Sos el analista central de SmartMargin AI. Generá un reporte ejecutivo estratégico en español (máximo 150 palabras):

RESUMEN EJECUTIVO GLOBAL:
Ingresos totales: $${ingresosTotales.toLocaleString()}
Gastos totales: $${gastosTotales.toLocaleString()}
Margen global: ${margen}%
Stock crítico global: ${stockCriticoGlobal} productos

DESGLOSE POR ZONA:
${datos.map(d => `- ${d.zona}: ${d.sucursales} sucursales, Ventas $${d.ventas.toLocaleString()}, Gastos $${d.gastos.toLocaleString()}, Stock crítico ${d.stockCritico}`).join('\n')}

Incluí:
- Análisis de rentabilidad global
- Zona de mejor y peor rendimiento
- Alertas críticas (stock, márgenes bajos)
- Recomendación estratégica de alto nivel`;

    resumenNLP = await generarContenido(prompt);
    
    if (!resumenNLP) {
      throw new Error('Gemini devolvió null');
    }
  } catch (error) {
    console.warn('Gemini falló en agenteCentral, usando fallback mock:', error.message);
    resumenNLP = `Ingresos totales: $${ingresosTotales.toLocaleString()}. Margen global: ${margen}%. 
${stockCriticoGlobal} productos con stock crítico. ${margen > 50 ? "La empresa es rentable." : "Atención: margen bajo."}`;
  }

  return { contenidoJSON, resumenNLP };
};

module.exports = { ejecutar };

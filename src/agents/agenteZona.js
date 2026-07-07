const { generarContenido } = require('../services/gemini.service');

const ejecutar = async (datos) => {
  // datos = [{ sucursal: "SmartMargin Norte", ventas: 1200000, gastos: 500000, stockCritico: 2 }]
  const totalVentas = datos.reduce((s, d) => s + d.ventas, 0);
  const totalGastos = datos.reduce((s, d) => s + d.gastos, 0);
  const ranking = [...datos].sort(
    (a, b) => b.ventas - b.gastos - (a.ventas - a.gastos),
  );
  
  const margenZonal = (((totalVentas - totalGastos) / totalVentas) * 100).toFixed(1);

  const contenidoJSON = {
    totalVentas,
    totalGastos,
    margenZonal,
    ranking,
  };

  // Intentar generar resumen con Gemini, fallback a mock
  let resumenNLP;
  try {
    const prompt = `Sos un analista de zona de SmartMargin AI. Analizá estos datos consolidados de sucursales y generá un resumen ejecutivo en español (máximo 100 palabras):

Zona con ${datos.length} sucursales:
${ranking.map((s, i) => `${i+1}. ${s.sucursal}: Ventas $${s.ventas.toLocaleString()}, Gastos $${s.gastos.toLocaleString()}, Margen ${(((s.ventas - s.gastos) / s.ventas) * 100).toFixed(1)}%`).join('\n')}

Total ventas: $${totalVentas.toLocaleString()}
Total gastos: $${totalGastos.toLocaleString()}
Margen zonal: ${margenZonal}%

Incluí:
- Sucursal líder y peor rendimiento
- Análisis comparativo
- Recomendación de acciones`;

    resumenNLP = await generarContenido(prompt);
    
    if (!resumenNLP) {
      throw new Error('Gemini devolvió null');
    }
  } catch (error) {
    console.warn('Gemini falló en agenteZona, usando fallback mock:', error.message);
    resumenNLP = `Zona consolidada: ${datos.length} sucursales. Ventas totales: $${totalVentas.toLocaleString()}. Sucursal líder: ${ranking[0]?.sucursal}.`;
  }

  return { contenidoJSON, resumenNLP };
};

module.exports = { ejecutar };

const { generarContenido } = require('../services/gemini.service');

const ejecutar = async (datos) => {
  // datos = [{ tipo: "Alquiler", monto: 45000, proveedor: "Inmobiliaria Norte", fecha: "2026-06-05" }]
  const totalGastos = datos.reduce((sum, d) => sum + d.monto, 0);
  
  // Agrupar por tipo
  const porCategoria = {};
  datos.forEach((d) => {
    porCategoria[d.tipo] = (porCategoria[d.tipo] || 0) + d.monto;
  });
  
  // Detectar duplicados (mismo tipo + mismo monto + fechas cercanas)
  const anomalias = [];
  datos.forEach((d, i) => {
    const duplicado = datos.find(
      (d2, j) => j !== i && d2.tipo === d.tipo && d2.monto === d.monto,
    );
    if (
      duplicado &&
      !anomalias.some((a) => a.tipo === d.tipo && a.monto === d.monto)
    ) {
      anomalias.push({
        tipo: d.tipo,
        monto: d.monto,
        proveedor: d.proveedor,
        alerta: "Posible duplicado",
      });
    }
  });
  
  const contenidoJSON = {
    totalGastos,
    gastosPorCategoria: porCategoria,
    anomalias,
  };

  // Intentar generar resumen con Gemini, fallback a mock
  let resumenNLP;
  try {
    const prompt = `Sos un analista financiero de SmartMargin AI. Analizá estos datos de gastos y generá un resumen ejecutivo en español (máximo 100 palabras):

Gastos totales: $${totalGastos.toLocaleString()}
Distribución por categoría: ${Object.entries(porCategoria).map(([k, v]) => `${k}: $${v.toLocaleString()}`).join(', ')}
Anomalías detectadas: ${anomalias.length} (${anomalias.map(a => `${a.tipo} $${a.monto.toLocaleString()}`).join(', ')})

Incluí:
- Análisis de distribución de gastos
- Alertas sobre anomalías
- Recomendación de ahorro potencial`;

    resumenNLP = await generarContenido(prompt);
    
    if (!resumenNLP) {
      throw new Error('Gemini devolvió null');
    }
  } catch (error) {
    console.warn('Gemini falló en agenteFinanzas, usando fallback mock:', error.message);
    resumenNLP = `Gastos totales: $${totalGastos.toLocaleString()}. ${
      anomalias.length > 0
        ? `⚠ ${anomalias.length} anomalías detectadas: ${anomalias.map((a) => a.tipo).join(", ")}.`
        : "No se detectaron anomalías."
    }`;
  }

  return { contenidoJSON, resumenNLP };
};

module.exports = { ejecutar };

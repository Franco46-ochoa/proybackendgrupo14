const ejecutar = (datos) => {
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
  const resumenNLP = `Ingresos totales: $${ingresosTotales.toLocaleString()}. Margen global: ${margen}%. 
${stockCriticoGlobal} productos con stock crítico. ${margen > 50 ? "La empresa es rentable." : "Atención: margen bajo."}`;
  return { contenidoJSON, resumenNLP };
};

module.exports = { ejecutar };

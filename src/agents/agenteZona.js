const ejecutar = (datos) => {
  // datos = [{ sucursal: "SmartMargin Norte", ventas: 1200000, gastos: 500000, stockCritico: 2 }]
  const totalVentas = datos.reduce((s, d) => s + d.ventas, 0);
  const totalGastos = datos.reduce((s, d) => s + d.gastos, 0);
  const ranking = [...datos].sort(
    (a, b) => b.ventas - b.gastos - (a.ventas - a.gastos),
  );

  const contenidoJSON = {
    totalVentas,
    totalGastos,
    margenZonal: (((totalVentas - totalGastos) / totalVentas) * 100).toFixed(1),
    ranking,
  };
  const resumenNLP = `Zona consolidada: ${datos.length} sucursales. Ventas totales: $${totalVentas.toLocaleString()}. 
Sucursal líder: ${ranking[0]?.sucursal}.`;
  return { contenidoJSON, resumenNLP };
};

module.exports = { ejecutar };

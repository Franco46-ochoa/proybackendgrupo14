const ejecutar = (datos) => {
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
  const resumenNLP = `Gastos totales: $${totalGastos.toLocaleString()}. ${
    anomalias.length > 0
      ? `⚠ ${anomalias.length} 
anomalías detectadas: ${anomalias.map((a) => a.tipo).join(", ")}.`
      : "No se detectaron anomalías."
  }`;
  return { contenidoJSON, resumenNLP };
};

module.exports = { ejecutar };

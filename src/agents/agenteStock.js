const ejecutar = (datos) => {
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
  const resumenNLP =
    stockCritico.length > 0
      ? `Se detectaron ${stockCritico.length} productos con stock crítico. ${diasRestantes
          .map(
            (d) => `${d.producto} 
(${d.stockActual}u, mínimo ${d.stockMinimo}u)`,
          )
          .join(". ")}.`
      : "Todos los productos tienen stock adecuado.";
  return { contenidoJSON, resumenNLP };
};
module.exports = { ejecutar };

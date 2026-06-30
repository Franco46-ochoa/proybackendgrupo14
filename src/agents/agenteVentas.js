const ejecutar = (datos) => {
  // datos = [{ producto: "Leche", cantidad: 15, total: 3150, fecha: "2026-06-10" }]
  const totalVentas = datos.reduce((sum, d) => sum + d.total, 0);
  const cantidadVentas = datos.length;
  const ticketPromedio = cantidadVentas > 0 ? totalVentas / cantidadVentas : 0;
  // Producto más vendido
  const porProducto = {};
  datos.forEach((d) => {
    porProducto[d.producto] = (porProducto[d.producto] || 0) + d.cantidad;
  });
  const topProductos = Object.entries(porProducto)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
  const tendencia = "+12%"; // Mock fijo

  const contenidoJSON = {
    totalVentas,
    cantidadVentas,
    ticketPromedio,
    topProductos,
    tendencia,
  };
  const resumenNLP = `Ventas totales: $${totalVentas.toLocaleString()} (${tendencia} vs mes anterior). Producto estrella: ${topProductos[0]?.[0] || "N/A"} (${topProductos[0]?.[1] || 0}u). Ticket promedio: $${ticketPromedio.toFixed(2)}.`;

  return { contenidoJSON, resumenNLP };
};

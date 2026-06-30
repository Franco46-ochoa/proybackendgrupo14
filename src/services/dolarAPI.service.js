// Sprint 2: Integración con API de cotización del dólar
// Fuente sugerida: https://dolarapi.com/v1/dolares/blue

let cache = { valor: null, timestamp: null };
const TIEMPO_CACHE = 60 * 60 * 1000; // 1 hora

/**
 * Obtiene la cotización del dólar blue (compra y venta).
 * Usa caché en memoria: solo consulta la API si pasó más de 1 hora.
 * Sprint 2: usar fetch() o axios para consultar la API.
 */
const obtenerCotizacion = async () => {
  const ahora = Date.now();
  if (cache.valor && cache.timestamp && (ahora - cache.timestamp < TIEMPO_CACHE)) {
    return cache.valor;
  }
  throw new Error("No implementado — Sprint 2");
  // Sprint 2:
  // const response = await fetch('https://dolarapi.com/v1/dolares/blue');
  // const data = await response.json();
  // cache = { valor: data, timestamp: ahora };
  // return data;
};

module.exports = { obtenerCotizacion };

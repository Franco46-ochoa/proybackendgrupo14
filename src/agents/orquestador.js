const agenteStock = require('./agenteStock');
const agenteVentas = require('./agenteVentas');
const agenteFinanzas = require('./agenteFinanzas');
const agenteZona = require('./agenteZona');
const agenteCentral = require('./agenteCentral');
const orquestador = async ({ tipo, sucursalId, zonaId, usuarioId }) => {
  let resultado;
  switch (tipo) {
    case 'sector': {
      const datosStock = [];    // Sprint 2: consultar BD
      const datosVentas = [];   // Sprint 2: consultar BD
      const datosFinanzas = []; // Sprint 2: consultar BD
      resultado = {
        stock: agenteStock.ejecutar(datosStock),
        ventas: agenteVentas.ejecutar(datosVentas),
        finanzas: agenteFinanzas.ejecutar(datosFinanzas),
      };
      break;
    }
    case 'zona': {
      const datosZona = []; // Sprint 2: consolidar sucursales de la zona
      resultado = agenteZona.ejecutar(datosZona);
      break;
    }
    case 'central': {
      const datosCentral = []; // Sprint 2: consolidar zonas
      resultado = agenteCentral.ejecutar(datosCentral);
      break;
    }
    default:
      throw new Error(`Tipo de agente no válido: ${tipo}`);
  }
  return resultado;
};
module.exports = { orquestador };
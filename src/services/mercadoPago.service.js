// Sprint 2: Integración con MercadoPago SDK
// Documentación: https://www.mercadopago.com.ar/developers/es/reference

const MERCADOPAGO_TOKEN = process.env.MP_ACCESS_TOKEN;

/**
 * Crea una preferencia de pago y devuelve la URL de checkout.
 * Sprint 2: usar mercadopago.preferences.create()
 */
const crearPreferencia = async ({ plan, monto, usuarioId }) => {
  throw new Error("No implementado — Sprint 2");
  // Sprint 2:
  // const mp = new MercadoPagoConfig({ accessToken: MERCADOPAGO_TOKEN });
  // const preference = new Preference(mp);
  // return await preference.create({ items: [...], back_urls: {...} });
};

/**
 * Procesa un webhook de MercadoPago validando la firma x-signature.
 * Sprint 2: usar crypto para verificar firma contra x-signature header.
 */
const manejarWebhook = async (body, signature) => {
  throw new Error("No implementado — Sprint 2");
  // Sprint 2:
  // 1. Validar firma con crypto.createHmac('sha256', secret)
  // 2. Si el pago está aprobado, actualizar suscripcion.estado = 'activo'
  // 3. Si no, loguear el evento
};

module.exports = { crearPreferencia, manejarWebhook };

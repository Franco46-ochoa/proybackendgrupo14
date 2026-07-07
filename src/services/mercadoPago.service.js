const { MercadoPagoConfig, Preference } = require('mercadopago');
const crypto = require('crypto');
const { Suscripcion } = require('../models');

const MERCADOPAGO_TOKEN = process.env.MP_ACCESS_TOKEN;
const WEBHOOK_URL = process.env.WEBHOOK_URL || 'https://smartmargin-api.onrender.com/api/pagos/webhook';
const WEBHOOK_SECRET = process.env.MP_WEBHOOK_SECRET; // Opcional

const mpClient = new MercadoPagoConfig({ accessToken: MERCADOPAGO_TOKEN });

const crearPreferencia = async ({ plan, monto, usuarioId }) => {
  const preference = new Preference(mpClient);
  
  const preferenceData = {
    items: [
      {
        id: `plan-${plan}`,
        title: `SmartMargin AI - Plan ${plan}`,
        quantity: 1,
        unit_price: parseFloat(monto),
        currency_id: 'ARS',
      }
    ],
    back_urls: {
      success: `${WEBHOOK_URL}/success`,
      failure: `${WEBHOOK_URL}/failure`,
      pending: `${WEBHOOK_URL}/pending`
    },
    auto_return: 'approved',
    external_reference: `usuario-${usuarioId}-plan-${plan}`,
    notification_url: WEBHOOK_URL
  };

  const result = await preference.create({ body: preferenceData });
  
  return {
    id: result.id,
    init_point: result.init_point,
    sandbox_init_point: result.sandbox_init_point
  };
};

const manejarWebhook = async (body, signature) => {
  // Validar firma de MercadoPago (OPCIONAL - solo si hay secret configurado)
  if (signature && WEBHOOK_SECRET) {
    const hash = crypto.createHmac('sha256', WEBHOOK_SECRET).update(JSON.stringify(body)).digest('hex');
    
    if (hash !== signature) {
      console.warn('⚠️  Webhook recibido con firma inválida');
      throw new Error('Firma inválida');
    }
  } else if (signature && !WEBHOOK_SECRET) {
    console.warn('⚠️  MP_WEBHOOK_SECRET no configurado - validación de firma omitida');
  }

  const { type, data } = body;

  if (type === 'payment') {
    const paymentId = data.id;
    const externalReference = body.data.external_reference;
    
    // Extraer usuarioId y plan del external_reference
    const match = externalReference.match(/usuario-(\d+)-plan-(\w+)/);
    if (!match) {
      console.error('External reference inválido:', externalReference);
      return;
    }

    const usuarioId = parseInt(match[1]);
    const plan = match[2];

    // Buscar o crear suscripción
    const [suscripcion, created] = await Suscripcion.findOrCreate({
      where: { usuarioId },
      defaults: {
        plan,
        estado: 'pendiente',
        monto: 0,
        mercadoPagoId: paymentId
      }
    });

    // Actualizar estado según el pago
    if (body.data.status === 'approved') {
      await suscripcion.update({
        estado: 'activo',
        mercadoPagoId: paymentId,
        fechaPago: new Date()
      });
    } else if (body.data.status === 'rejected') {
      await suscripcion.update({
        estado: 'cancelado'
      });
    }
  }
};

module.exports = { crearPreferencia, manejarWebhook };

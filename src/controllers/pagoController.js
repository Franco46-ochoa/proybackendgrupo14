const { crearPreferencia, manejarWebhook } = require('../services/mercadoPago.service');
const { Suscripcion } = require('../models');

const pagoController = {
  crearPreferencia: async (req, res) => {
    try {
      const { plan, monto } = req.body;
      const usuarioId = req.usuario.id;

      if (!plan || !monto) {
        return res.status(400).json({
          success: false,
          message: 'Plan y monto son obligatorios'
        });
      }

      const preferencia = await crearPreferencia({ plan, monto, usuarioId });

      res.json({
        success: true,
        data: preferencia,
        message: 'Preferencia de pago creada'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al crear preferencia: ' + error.message
      });
    }
  },

  manejarWebhook: async (req, res) => {
    try {
      const signature = req.headers['x-signature'];
      const body = req.body;

      await manejarWebhook(body, signature);

      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error en webhook: ' + error.message
      });
    }
  },

  obtenerEstado: async (req, res) => {
    try {
      const usuarioId = req.usuario.id;
      
      const suscripcion = await Suscripcion.findOne({
        where: { usuarioId },
        attributes: ['id', 'plan', 'estado', 'monto', 'fechaPago']
      });

      if (!suscripcion) {
        return res.status(404).json({
          success: false,
          message: 'No hay suscripción activa'
        });
      }

      res.json({
        success: true,
        data: suscripcion
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener estado: ' + error.message
      });
    }
  }
};

module.exports = pagoController;

const { Suscripcion, Usuario } = require('../models');

const suscripcionController = {
  crear: async (req, res) => {
    try {
      const { plan, monto, datosComprador } = req.body;
      const usuarioId = req.usuario.id;

      const existente = await Suscripcion.findOne({ where: { usuarioId } });
      if (existente && existente.estado === 'activo') {
        return res.status(400).json({
          success: false,
          message: 'Ya tenes una suscripcion activa',
        });
      }

      if (existente) {
        await existente.update({
          plan,
          estado: 'activo',
          monto,
        });
        return res.json({
          success: true,
          data: existente,
          message: 'Suscripcion reactivada exitosamente',
        });
      }

      const suscripcion = await Suscripcion.create({
        plan,
        estado: 'activo',
        monto,
        usuarioId,
      });

      res.status(201).json({
        success: true,
        data: suscripcion,
        message: 'Suscripcion creada exitosamente',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al crear suscripcion: ' + error.message,
      });
    }
  },

  obtener: async (req, res) => {
    try {
      const usuarioId = req.usuario.id;

      const suscripcion = await Suscripcion.findOne({ where: { usuarioId } });

      if (!suscripcion) {
        return res.json({
          success: true,
          data: null,
          message: 'No tenes suscripcion activa',
        });
      }

      res.json({
        success: true,
        data: suscripcion,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener suscripcion: ' + error.message,
      });
    }
  },
};

module.exports = suscripcionController;

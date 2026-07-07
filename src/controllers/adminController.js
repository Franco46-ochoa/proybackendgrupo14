const { seedData } = require('../seeders/seedData');

const adminController = {
  cargarDatosHistoricos: async (req, res) => {
    try {
      const empresaId = req.usuario.empresaId;
      const usuarioId = req.usuario.id;

      if (!empresaId) {
        return res.status(400).json({
          success: false,
          message: 'El administrador no tiene una empresa asociada. Contacte al dueño.',
        });
      }

      const resultado = await seedData(empresaId, usuarioId);

      return res.status(201).json({
        success: true,
        message: 'Base de datos histórica cargada con éxito (2020-2026).',
        data: resultado,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error al cargar datos semilla: ' + error.message,
      });
    }
  },
};

module.exports = adminController;

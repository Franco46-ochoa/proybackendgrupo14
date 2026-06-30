const { Zona, Usuario } = require('../models');

const zonaController = {
  // GET /api/zonas - Dueno: todas, Gerente: solo su zona
  listar: async (req, res) => {
    try {
      const usuario = await Usuario.findByPk(req.usuario.id);

      let zonas;
      if (usuario.rol === 'dueno') {
        zonas = await Zona.findAll({ order: [['nombre', 'ASC']] });
      } else {
        zonas = await Zona.findAll({
          where: { id: usuario.zonaId },
          order: [['nombre', 'ASC']],
        });
      }

      res.json({
        success: true,
        data: zonas,
        message: 'Zonas listadas exitosamente',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al listar zonas: ' + error.message,
      });
    }
  },

  // POST /api/zonas - solo Dueno
  crear: async (req, res) => {
    try {
      const { nombre } = req.body;

      if (!nombre || !nombre.trim()) {
        return res.status(400).json({
          success: false,
          message: 'El nombre de la zona es obligatorio',
        });
      }

      const existente = await Zona.findOne({ where: { nombre: nombre.trim() } });
      if (existente) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe una zona con ese nombre',
        });
      }

      const zona = await Zona.create({ nombre: nombre.trim() });

      res.status(201).json({
        success: true,
        data: zona,
        message: 'Zona creada exitosamente',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al crear zona: ' + error.message,
      });
    }
  },

  // PUT /api/zonas/:id - solo Dueno
  actualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre } = req.body;

      const zona = await Zona.findByPk(id);
      if (!zona) {
        return res.status(404).json({
          success: false,
          message: 'Zona no encontrada',
        });
      }

      if (!nombre || !nombre.trim()) {
        return res.status(400).json({
          success: false,
          message: 'El nombre de la zona es obligatorio',
        });
      }

      const existente = await Zona.findOne({
        where: { nombre: nombre.trim(), id: { [require('sequelize').Op.ne]: id } },
      });
      if (existente) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe otra zona con ese nombre',
        });
      }

      await zona.update({ nombre: nombre.trim() });

      res.json({
        success: true,
        data: zona,
        message: 'Zona actualizada exitosamente',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al actualizar zona: ' + error.message,
      });
    }
  },

  // DELETE /api/zonas/:id - solo Dueno
  eliminar: async (req, res) => {
    try {
      const { id } = req.params;

      const zona = await Zona.findByPk(id);
      if (!zona) {
        return res.status(404).json({
          success: false,
          message: 'Zona no encontrada',
        });
      }

      await zona.destroy();

      res.json({
        success: true,
        data: { id: parseInt(id) },
        message: 'Zona eliminada exitosamente',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al eliminar zona: ' + error.message,
      });
    }
  },
};

module.exports = zonaController;

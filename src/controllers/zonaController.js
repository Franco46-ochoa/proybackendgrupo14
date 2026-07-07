const { Zona, Usuario } = require('../models');

const zonaController = {
  // GET /api/zonas - Dueno/Admin: todas las suyas, Gerente: solo su zona
  listar: async (req, res) => {
    try {
      const usuario = await Usuario.findByPk(req.usuario.id);

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      let result;
      if (usuario.rol === 'dueno') {
        result = await Zona.findAndCountAll({
          where: { empresaId: usuario.id },
          offset, limit,
          order: [['nombre', 'ASC']],
        });
      } else if (usuario.rol === 'administrador') {
        result = await Zona.findAndCountAll({
          where: { empresaId: usuario.empresaId },
          offset, limit,
          order: [['nombre', 'ASC']],
        });
      } else if (usuario.rol === 'gerente') {
        result = await Zona.findAndCountAll({
          where: { id: usuario.zonaId },
          offset, limit,
          order: [['nombre', 'ASC']],
        });
      } else {
        return res.status(403).json({ success: false, message: 'Acceso denegado' });
      }

      const { count: total, rows: data } = result;

      res.json({
        success: true,
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
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

      const zona = await Zona.create({
        nombre: nombre.trim(),
        empresaId: req.usuario.id,
      });

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

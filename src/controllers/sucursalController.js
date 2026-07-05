const { Sucursal, Usuario } = require('../models');

const sucursalController = {
  // GET /api/sucursales - Dueno: todas, Gerente: su zona, Empleado: su sucursal
  listar: async (req, res) => {
    try {
      const usuario = await Usuario.findByPk(req.usuario.id);

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      let result;
      if (usuario.rol === 'dueno') {
        result = await Sucursal.findAndCountAll({
          include: [{ association: 'zona', attributes: ['id', 'nombre'] }],
          offset,
          limit,
          order: [['nombre', 'ASC']],
        });
      } else if (usuario.rol === 'gerente') {
        result = await Sucursal.findAndCountAll({
          where: { zonaId: usuario.zonaId },
          include: [{ association: 'zona', attributes: ['id', 'nombre'] }],
          offset,
          limit,
          order: [['nombre', 'ASC']],
        });
      } else {
        result = await Sucursal.findAndCountAll({
          where: { id: usuario.sucursalId },
          include: [{ association: 'zona', attributes: ['id', 'nombre'] }],
          offset,
          limit,
        });
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
        message: 'Error al listar sucursales: ' + error.message,
      });
    }
  },

  // POST /api/sucursales - solo Dueno
  crear: async (req, res) => {
    try {
      const { nombre, direccion, lat, lng, telefono, zonaId } = req.body;

      if (!nombre || !nombre.trim()) {
        return res.status(400).json({
          success: false,
          message: 'El nombre de la sucursal es obligatorio',
        });
      }

      if (!zonaId) {
        return res.status(400).json({
          success: false,
          message: 'La zona es obligatoria',
        });
      }

      const sucursal = await Sucursal.create({
        nombre: nombre.trim(),
        direccion: direccion || null,
        lat: lat || null,
        lng: lng || null,
        telefono: telefono || null,
        zonaId,
      });

      res.status(201).json({
        success: true,
        data: sucursal,
        message: 'Sucursal creada exitosamente',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al crear sucursal: ' + error.message,
      });
    }
  },

  // PUT /api/sucursales/:id - solo Dueno
  actualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre, direccion, lat, lng, telefono, zonaId } = req.body;

      const sucursal = await Sucursal.findByPk(id);
      if (!sucursal) {
        return res.status(404).json({
          success: false,
          message: 'Sucursal no encontrada',
        });
      }

      await sucursal.update({
        nombre: nombre !== undefined ? nombre : sucursal.nombre,
        direccion: direccion !== undefined ? direccion : sucursal.direccion,
        lat: lat !== undefined ? lat : sucursal.lat,
        lng: lng !== undefined ? lng : sucursal.lng,
        telefono: telefono !== undefined ? telefono : sucursal.telefono,
        zonaId: zonaId !== undefined ? zonaId : sucursal.zonaId,
      });

      res.json({
        success: true,
        data: sucursal,
        message: 'Sucursal actualizada exitosamente',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al actualizar sucursal: ' + error.message,
      });
    }
  },

  // DELETE /api/sucursales/:id - solo Dueno
  eliminar: async (req, res) => {
    try {
      const { id } = req.params;

      const sucursal = await Sucursal.findByPk(id);
      if (!sucursal) {
        return res.status(404).json({
          success: false,
          message: 'Sucursal no encontrada',
        });
      }

      await sucursal.destroy();

      res.json({
        success: true,
        data: { id: parseInt(id) },
        message: 'Sucursal eliminada exitosamente',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al eliminar sucursal: ' + error.message,
      });
    }
  },
};

module.exports = sucursalController;

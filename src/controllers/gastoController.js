const { Op } = require('sequelize');
const { Gasto } = require('../models');

const gastoController = {
  // GET /api/gastos
  listar: async (req, res) => {
    try {
      const { sucursalId, proveedorId, tipo, fecha } = req.query;
      const where = {};

      if (sucursalId) where.sucursalId = parseInt(sucursalId, 10);
      if (proveedorId) where.proveedorId = parseInt(proveedorId, 10);
      if (tipo) where.tipo = tipo;
      if (fecha) where.fecha = new Date(fecha);

      const gastos = await Gasto.findAll({
        where,
        include: [
          { association: 'proveedor', attributes: ['id', 'nombre', 'cuit'] },
          { association: 'sucursal', attributes: ['id', 'nombre'] },
        ],
        order: [['fecha', 'DESC']],
      });

      res.json({
        success: true,
        data: gastos,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al listar gastos: ' + error.message,
      });
    }
  },

  // POST /api/gastos
  crear: async (req, res) => {
    try {
      const { tipo, monto, descripcion, fecha, proveedorId, sucursalId } = req.body;

      if (!tipo || !tipo.trim()) {
        return res.status(400).json({
          success: false,
          message: 'El tipo de gasto es obligatorio',
        });
      }
      if (monto === undefined || monto === null || Number(monto) <= 0) {
        return res.status(400).json({
          success: false,
          message: 'El monto debe ser un numero positivo',
        });
      }
      if (!sucursalId) {
        return res.status(400).json({
          success: false,
          message: 'La sucursal es obligatoria',
        });
      }

      const gasto = await Gasto.create({
        tipo: tipo.trim(),
        monto,
        descripcion: descripcion || null,
        fecha: fecha || new Date(),
        proveedorId: proveedorId || null,
        sucursalId,
      });

      res.status(201).json({
        success: true,
        data: gasto,
        message: 'Gasto registrado exitosamente',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al registrar gasto: ' + error.message,
      });
    }
  },

  // PUT /api/gastos/:id
  actualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const { tipo, monto, descripcion, fecha, proveedorId, sucursalId } = req.body;

      const gasto = await Gasto.findByPk(id);
      if (!gasto) {
        return res.status(404).json({
          success: false,
          message: 'Gasto no encontrado',
        });
      }

      await gasto.update({
        tipo: tipo !== undefined ? tipo : gasto.tipo,
        monto: monto !== undefined ? monto : gasto.monto,
        descripcion: descripcion !== undefined ? descripcion : gasto.descripcion,
        fecha: fecha !== undefined ? fecha : gasto.fecha,
        proveedorId: proveedorId !== undefined ? proveedorId : gasto.proveedorId,
        sucursalId: sucursalId !== undefined ? sucursalId : gasto.sucursalId,
      });

      res.json({
        success: true,
        data: gasto,
        message: 'Gasto actualizado exitosamente',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al actualizar gasto: ' + error.message,
      });
    }
  },

  // DELETE /api/gastos/:id
  eliminar: async (req, res) => {
    try {
      const { id } = req.params;

      const gasto = await Gasto.findByPk(id);
      if (!gasto) {
        return res.status(404).json({
          success: false,
          message: 'Gasto no encontrado',
        });
      }

      await gasto.destroy();

      res.json({
        success: true,
        data: { id: parseInt(id) },
        message: 'Gasto eliminado exitosamente',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al eliminar gasto: ' + error.message,
      });
    }
  },
};

module.exports = gastoController;

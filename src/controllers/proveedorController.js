const { Proveedor, Gasto } = require('../models');

const proveedorController = {
  // GET /api/proveedores
  listar: async (req, res) => {
    try {
      const proveedores = await Proveedor.findAll({
        order: [['nombre', 'ASC']],
      });

      res.json({
        success: true,
        data: proveedores,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al listar proveedores: ' + error.message,
      });
    }
  },

  // POST /api/proveedores
  crear: async (req, res) => {
    try {
      const { nombre, cuit, contacto } = req.body;

      if (!nombre || !nombre.trim()) {
        return res.status(400).json({
          success: false,
          message: 'El nombre del proveedor es obligatorio',
        });
      }
      if (!cuit || !cuit.trim()) {
        return res.status(400).json({
          success: false,
          message: 'El CUIT es obligatorio',
        });
      }

      const existente = await Proveedor.findOne({ where: { cuit } });
      if (existente) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe un proveedor con ese CUIT',
        });
      }

      const proveedor = await Proveedor.create({
        nombre: nombre.trim(),
        cuit: cuit.trim(),
        contacto: contacto || null,
      });

      res.status(201).json({
        success: true,
        data: proveedor,
        message: 'Proveedor creado exitosamente',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al crear proveedor: ' + error.message,
      });
    }
  },

  // PUT /api/proveedores/:id
  actualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre, cuit, contacto } = req.body;

      const proveedor = await Proveedor.findByPk(id);
      if (!proveedor) {
        return res.status(404).json({
          success: false,
          message: 'Proveedor no encontrado',
        });
      }

      if (cuit && cuit !== proveedor.cuit) {
        const existente = await Proveedor.findOne({ where: { cuit } });
        if (existente) {
          return res.status(400).json({
            success: false,
            message: 'Ya existe otro proveedor con ese CUIT',
          });
        }
      }

      await proveedor.update({
        nombre: nombre !== undefined ? nombre : proveedor.nombre,
        cuit: cuit !== undefined ? cuit : proveedor.cuit,
        contacto: contacto !== undefined ? contacto : proveedor.contacto,
      });

      res.json({
        success: true,
        data: proveedor,
        message: 'Proveedor actualizado exitosamente',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al actualizar proveedor: ' + error.message,
      });
    }
  },

  // DELETE /api/proveedores/:id - Solo Dueno
  eliminar: async (req, res) => {
    try {
      const { id } = req.params;

      const proveedor = await Proveedor.findByPk(id);
      if (!proveedor) {
        return res.status(404).json({
          success: false,
          message: 'Proveedor no encontrado',
        });
      }

      const gastosAsociados = await Gasto.count({ where: { proveedorId: id } });
      if (gastosAsociados > 0) {
        return res.status(400).json({
          success: false,
          message: 'No se puede eliminar el proveedor porque tiene gastos asociados',
        });
      }

      await proveedor.destroy();

      res.json({
        success: true,
        data: { id: parseInt(id) },
        message: 'Proveedor eliminado exitosamente',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al eliminar proveedor: ' + error.message,
      });
    }
  },
};

module.exports = proveedorController;

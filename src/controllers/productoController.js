const { Op } = require('sequelize');
const { Producto, Inventario } = require('../models');

const productoController = {
  // GET /api/productos
  listar: async (req, res) => {
    try {
      const { categoria, busqueda } = req.query;
      const where = {};

      if (categoria) {
        where.categoria = categoria;
      }
      if (busqueda) {
        where.nombre = { [Op.iLike]: `%${busqueda}%` };
      }

      const productos = await Producto.findAll({
        where,
        order: [['nombre', 'ASC']],
      });

      res.json({
        success: true,
        data: productos,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al listar productos: ' + error.message,
      });
    }
  },

  // POST /api/productos
  crear: async (req, res) => {
    try {
      const { nombre, codigo, categoria, descripcion, precioCompra, unidadMedida } = req.body;

      if (!nombre || !nombre.trim()) {
        return res.status(400).json({
          success: false,
          message: 'El nombre del producto es obligatorio',
        });
      }
      if (!codigo || !codigo.trim()) {
        return res.status(400).json({
          success: false,
          message: 'El codigo del producto es obligatorio',
        });
      }
      if (precioCompra === undefined || precioCompra === null || Number(precioCompra) <= 0) {
        return res.status(400).json({
          success: false,
          message: 'El precio de compra debe ser un numero positivo',
        });
      }

      const existente = await Producto.findOne({ where: { codigo } });
      if (existente) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe un producto con ese codigo',
        });
      }

      const producto = await Producto.create({
        nombre: nombre.trim(),
        codigo: codigo.trim(),
        categoria: categoria || null,
        descripcion: descripcion || null,
        precioCompra,
        unidadMedida: unidadMedida || 'unidad',
      });

      res.status(201).json({
        success: true,
        data: producto,
        message: 'Producto creado exitosamente',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al crear producto: ' + error.message,
      });
    }
  },

  // PUT /api/productos/:id
  actualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre, codigo, categoria, descripcion, precioCompra, unidadMedida, activo } = req.body;

      const producto = await Producto.findByPk(id);
      if (!producto) {
        return res.status(404).json({
          success: false,
          message: 'Producto no encontrado',
        });
      }

      if (codigo && codigo !== producto.codigo) {
        const existente = await Producto.findOne({ where: { codigo } });
        if (existente) {
          return res.status(400).json({
            success: false,
            message: 'Ya existe otro producto con ese codigo',
          });
        }
      }

      if (precioCompra !== undefined && Number(precioCompra) <= 0) {
        return res.status(400).json({
          success: false,
          message: 'El precio de compra debe ser un numero positivo',
        });
      }

      await producto.update({
        nombre: nombre !== undefined ? nombre : producto.nombre,
        codigo: codigo !== undefined ? codigo : producto.codigo,
        categoria: categoria !== undefined ? categoria : producto.categoria,
        descripcion: descripcion !== undefined ? descripcion : producto.descripcion,
        precioCompra: precioCompra !== undefined ? precioCompra : producto.precioCompra,
        unidadMedida: unidadMedida !== undefined ? unidadMedida : producto.unidadMedida,
        activo: activo !== undefined ? activo : producto.activo,
      });

      res.json({
        success: true,
        data: producto,
        message: 'Producto actualizado exitosamente',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al actualizar producto: ' + error.message,
      });
    }
  },

  // DELETE /api/productos/:id
  eliminar: async (req, res) => {
    try {
      const { id } = req.params;

      const producto = await Producto.findByPk(id);
      if (!producto) {
        return res.status(404).json({
          success: false,
          message: 'Producto no encontrado',
        });
      }

      const inventarioAsociado = await Inventario.count({ where: { productoId: id } });
      if (inventarioAsociado > 0) {
        return res.status(400).json({
          success: false,
          message: 'No se puede eliminar el producto porque tiene inventario asociado',
        });
      }

      await producto.destroy();

      res.json({
        success: true,
        data: { id: parseInt(id) },
        message: 'Producto eliminado exitosamente',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al eliminar producto: ' + error.message,
      });
    }
  },
};

module.exports = productoController;

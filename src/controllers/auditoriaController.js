const { Op } = require("sequelize");
const { Auditoria, Usuario } = require("../models");

const auditoriaController = {
  listar: async (req, res) => {
    try {
      const {
        usuarioId,
        accion,
        entidad,
        fechaDesde,
        fechaHasta,
        page = 1,
        limit = 20,
      } = req.query;

      const where = {};

      if (usuarioId) where.usuarioId = parseInt(usuarioId, 10);
      if (accion) where.accion = accion;
      if (entidad) where.entidad = entidad;

      if (fechaDesde || fechaHasta) {
        where.createdAt = {};
        if (fechaDesde) where.createdAt[Op.gte] = new Date(fechaDesde);
        if (fechaHasta) where.createdAt[Op.lte] = new Date(fechaHasta);
      }

      const pageNum = Math.max(1, parseInt(page, 10));
      const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
      const offset = (pageNum - 1) * limitNum;

      const { count, rows } = await Auditoria.findAndCountAll({
        where,
        include: [
          { association: "usuario", attributes: ["id", "nombre", "email", "rol"] },
        ],
        order: [["createdAt", "DESC"]],
        limit: limitNum,
        offset,
      });

      res.json({
        success: true,
        data: rows,
        total: count,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(count / limitNum),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al listar auditoria: " + error.message,
      });
    }
  },
};

module.exports = auditoriaController;

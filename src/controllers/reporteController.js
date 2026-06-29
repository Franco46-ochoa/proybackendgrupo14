const { orquestador } = require("../agents/orquestador");
const { ReporteAgente } = require("../models");

const listar = async (req, res) => {
  try {
    const reportes = await ReporteAgente.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.json({
      success: true,
      data: reportes,
      message: reportes.length
        ? `${reportes.length} reportes encontrados`
        : "No hay reportes generados aún",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al listar reportes: " + error.message,
    });
  }
};

const generar = async (req, res) => {
  try {
    const { tipo, sucursalId, zonaId } = req.body;
    if (!tipo || !["sector", "zona", "central"].includes(tipo)) {
      return res.status(400).json({
        success: false,
        message: "Tipo de reporte inválido. Use: sector, zona o central",
      });
    }
    if (tipo === "sector" && !sucursalId) {
      return res.status(400).json({
        success: false,
        message: "sucursalId es obligatorio para reportes de sector",
      });
    }
    if (tipo === "zona" && !zonaId) {
      return res.status(400).json({
        success: false,
        message: "zonaId es obligatorio para reportes de zona",
      });
    }
    const resultado = await orquestador({
      tipo,
      sucursalId,
      zonaId,
      usuarioId: req.usuario.id,
    });
    res.json({
      success: true,
      data: resultado,
      message: "Reporte generado exitosamente",
    });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error al generar reporte: " + error.message,
      });
  }
};

module.exports = { listar, generar };

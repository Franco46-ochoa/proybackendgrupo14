const crypto = require("crypto");
const { CodigoInvitacion, Suscripcion } = require("../models");

const obtenerEmpresaId = (req) => {
  if (req.usuario.rol === "dueno") return req.usuario.id;
  if (req.usuario.rol === "administrador") return req.usuario.empresaId;
  return null;
};

const LIMITES = {
  basico: { gerentes: 3, empleados: 30 },
  pro: { gerentes: 10, empleados: 100 },
  enterprise: { gerentes: Infinity, empleados: Infinity },
};

const generarCodigoAleatorio = (rol) => {
  const hex = crypto.randomBytes(4).toString("hex").toUpperCase();
  const prefijo =
    rol === "administrador" ? "ADM" : rol === "gerente" ? "GER" : "EMP";
  return `${prefijo}-${hex}`;
};

const listar = async (req, res) => {
  try {
    const empresaId = obtenerEmpresaId(req);
    const codigos = await CodigoInvitacion.findAll({
      where: { empresaId },
      order: [["createdAt", "DESC"]],
    });

    res.json({
      success: true,
      data: codigos,
      message: codigos.length
        ? `${codigos.length} códigos encontrados`
        : "No hay códigos generados aún",
    });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error al listar códigos: " + error.message,
      });
  }
};

const generar = async (req, res) => {
  try {
    const { rol, usosMaximos, sucursalId } = req.body;

    if (!rol || !["administrador", "gerente", "empleado"].includes(rol)) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Rol inválido. Use: administrador, gerente o empleado",
        });
    }

    const rolSolicitante = req.usuario.rol;
    if (!["dueno", "administrador"].includes(rolSolicitante)) {
      return res
        .status(403)
        .json({
          success: false,
          message: "No tenés permiso para generar códigos",
        });
    }
    if (rolSolicitante === "dueno" && rol !== "administrador") {
      return res
        .status(400)
        .json({
          success: false,
          message: "Solo podés generar código de Administrador",
        });
    }
    if (rolSolicitante === "administrador" && rol === "administrador") {
      return res
        .status(400)
        .json({
          success: false,
          message: "No podés generar código de Administrador",
        });
    }

    if (rolSolicitante === "dueno" && rol === "administrador") {
      const adminExistente = await CodigoInvitacion.findOne({
        where: {
          empresaId: obtenerEmpresaId(req),
          rol: "administrador",
          activo: true,
        },
      });
      if (adminExistente) {
        return res
          .status(400)
          .json({
            success: false,
            message: "Ya existe un código de Administrador activo",
          });
      }
    }

    if (!usosMaximos || usosMaximos < 1) {
      return res
        .status(400)
        .json({ success: false, message: "usosMaximos debe ser mayor a 0" });
    }

    const suscripcion = await Suscripcion.findOne({
      where: { usuarioId: obtenerEmpresaId(req), estado: "activo" },
    });

    if (!suscripcion) {
      return res.status(400).json({
        success: false,
        message:
          "No tenés una suscripción activa. Activá tu plan antes de generar códigos.",
      });
    }

    const limite = LIMITES[suscripcion.plan];
    if (!limite) {
      return res
        .status(400)
        .json({ success: false, message: "Plan de suscripción no reconocido" });
    }

    if (rol !== "administrador") {
      const clave = rol === "gerente" ? "gerentes" : "empleados";
      const maximoPlan = limite[clave];

      const totalActual =
        (await CodigoInvitacion.sum("usosMaximos", {
          where: { empresaId: obtenerEmpresaId(req), rol, activo: true },
        })) || 0;

      if (totalActual + usosMaximos > maximoPlan) {
        return res.status(400).json({
          success: false,
          message: `Excede el límite de tu plan (máx ${maximoPlan} ${clave}). Actualizá a un plan superior.`,
        });
      }
    }

    let codigo;
    let intentos = 0;
    while (intentos < 10) {
      codigo = generarCodigoAleatorio(rol);
      const existe = await CodigoInvitacion.findOne({ where: { codigo } });
      if (!existe) break;
      intentos++;
    }

    const nuevo = await CodigoInvitacion.create({
      codigo,
      rol,
      usosMaximos,
      empresaId: obtenerEmpresaId(req),
      sucursalId: sucursalId || null,
    });

    res.status(201).json({
      success: true,
      data: nuevo,
      message: `Código ${codigo} generado exitosamente`,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error al generar código: " + error.message,
      });
  }
};

const revocar = async (req, res) => {
  try {
    const codigo = await CodigoInvitacion.findOne({
      where: { id: req.params.id, empresaId: obtenerEmpresaId(req) },
    });

    if (!codigo) {
      return res
        .status(404)
        .json({ success: false, message: "Código no encontrado" });
    }

    await codigo.update({ activo: false });

    res.json({
      success: true,
      data: codigo,
      message: `Código ${codigo.codigo} revocado`,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error al revocar código: " + error.message,
      });
  }
};

module.exports = { listar, generar, revocar };

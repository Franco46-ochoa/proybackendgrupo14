const { Auditoria } = require("../models");

const METHOD_TO_ACTION = {
  POST: "CREATE",
  PUT: "UPDATE",
  DELETE: "DELETE",
};

const PATH_TO_ENTIDAD = {
  "/api/productos": "Producto",
  "/api/transacciones": "Transaccion",
  "/api/gastos": "Gasto",
  "/api/usuarios": "Usuario",
  "/api/sucursales": "Sucursal",
  "/api/inventario": "Inventario",
  "/api/codigos": "CodigoInvitacion",
  "/api/zonas": "Zona",
  "/api/proveedores": "Proveedor",
  "/api/reportes": "ReporteAgente",
};

function auditLog() {
  return (req, res, next) => {
    const method = req.method;
    const action = METHOD_TO_ACTION[method];

    if (!action) {
      return next();
    }

    const fullPath = req.baseUrl || req.originalUrl || req.path;
    const pathWithoutQuery = fullPath.split("?")[0];
    const basePath = "/" + pathWithoutQuery.split("/").filter(Boolean).slice(0, 2).join("/");
    const entidad = PATH_TO_ENTIDAD[basePath];

    if (!entidad) {
      return next();
    }

    const originalJson = res.json.bind(res);

    res.json = function (body) {
      if (body && body.success === true) {
        const usuarioId = req.usuario ? req.usuario.id : null;
        const entidadId =
          body.data && body.data.id ? body.data.id : req.params.id
            ? parseInt(req.params.id)
            : null;

        let datosNuevos = null;
        if (action === "CREATE" && body.data) {
          datosNuevos = body.data;
        } else if (action === "UPDATE" && body.data) {
          datosNuevos = body.data;
        }

        Auditoria.create({
          usuarioId,
          accion: action,
          entidad,
          entidadId,
          datosNuevos,
        }).catch((err) => {
          console.error("AuditLog error:", err.message);
        });
      }

      return originalJson(body);
    };

    next();
  };
}

module.exports = auditLog;

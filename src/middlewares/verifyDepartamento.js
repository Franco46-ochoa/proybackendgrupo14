const { Transaccion } = require('../models');

const verifyDepartamento = (...departamentosPermitidos) => {
  return (req, res, next) => {
    if (!req.usuario || !req.usuario.rol) {
      return res.status(403).json({
        success: false,
        message: 'Acceso denegado: no hay usuario autenticado',
      });
    }

    if (req.usuario.rol !== 'empleado') {
      return next();
    }

    const departamento = req.usuario.departamento;
    if (!departamento) {
      return res.status(403).json({
        success: false,
        message: 'Acceso denegado: el departamento del empleado no está definido',
      });
    }

    if (!departamentosPermitidos.includes(departamento)) {
      return res.status(403).json({
        success: false,
        message: `Acceso denegado: se requiere departamento ${departamentosPermitidos.join(' o ')}`,
      });
    }

    next();
  };
};

const verifyDepartamentoTransaccion = () => {
  return async (req, res, next) => {
    if (!req.usuario || !req.usuario.rol) {
      return res.status(403).json({
        success: false,
        message: 'Acceso denegado: no hay usuario autenticado',
      });
    }

    if (req.usuario.rol !== 'empleado') {
      return next();
    }

    let tipo = req.body.tipo;

    if (!tipo && req.method === 'PUT') {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'ID de transacción requerido para verificar el departamento',
        });
      }

      const transaccion = await Transaccion.findByPk(id);
      if (!transaccion) {
        return res.status(404).json({
          success: false,
          message: 'Transacción no encontrada',
        });
      }

      tipo = transaccion.tipo;
    }

    if (!tipo || !['venta', 'compra'].includes(tipo)) {
      return res.status(400).json({
        success: false,
        message: 'Tipo de transacción inválido. Debe ser venta o compra',
      });
    }

    const departamento = req.usuario.departamento;
    if (!departamento) {
      return res.status(403).json({
        success: false,
        message: 'Acceso denegado: el departamento del empleado no está definido',
      });
    }

    const permisoPorTipo = tipo === 'venta' ? 'comercial' : 'operativo';
    if (departamento !== permisoPorTipo) {
      return res.status(403).json({
        success: false,
        message: `Acceso denegado: solo empleados ${permisoPorTipo} pueden registrar transacciones de tipo ${tipo}`,
      });
    }

    next();
  };
};

module.exports = { verifyDepartamento, verifyDepartamentoTransaccion };
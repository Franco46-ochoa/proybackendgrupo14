const verifyRole = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.usuario || !req.usuario.rol) {
      return res.status(403).json({
        success: false,
        message: 'Acceso denegado: no hay rol definido',
      });
    }

    if (!rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({
        success: false,
        message: `Acceso denegado: se requiere rol ${rolesPermitidos.join(' o ')}`,
      });
    }

    next();
  };
};

module.exports = verifyRole;

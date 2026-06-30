const crypto = require('crypto');
const { CodigoInvitacion, Suscripcion } = require('../models');

const LIMITES = {
  basico: { gerentes: 3, empleados: 30 },
  pro: { gerentes: 10, empleados: 100 },
  enterprise: { gerentes: Infinity, empleados: Infinity },
};

const generarCodigoAleatorio = (rol) => {
  const hex = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `${rol === 'gerente' ? 'GER' : 'EMP'}-${hex}`;
};

const listar = async (req, res) => {
  try {
    const codigos = await CodigoInvitacion.findAll({
      where: { duenoId: req.usuario.id },
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      data: codigos,
      message: codigos.length ? `${codigos.length} códigos encontrados` : 'No hay códigos generados aún',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al listar códigos: ' + error.message });
  }
};

const generar = async (req, res) => {
  try {
    const { rol, usosMaximos, sucursalId } = req.body;

    if (!rol || !['gerente', 'empleado'].includes(rol)) {
      return res.status(400).json({ success: false, message: 'Rol inválido. Use: gerente o empleado' });
    }
    if (!usosMaximos || usosMaximos < 1) {
      return res.status(400).json({ success: false, message: 'usosMaximos debe ser mayor a 0' });
    }

    const suscripcion = await Suscripcion.findOne({
      where: { usuarioId: req.usuario.id, estado: 'activo' },
    });

    if (!suscripcion) {
      return res.status(400).json({
        success: false,
        message: 'No tenés una suscripción activa. Activá tu plan antes de generar códigos.',
      });
    }

    const limite = LIMITES[suscripcion.plan];
    if (!limite) {
      return res.status(400).json({ success: false, message: 'Plan de suscripción no reconocido' });
    }

    const clave = rol === 'gerente' ? 'gerentes' : 'empleados';
    const maximoPlan = limite[clave];

    const totalActual = await CodigoInvitacion.sum('usosMaximos', {
      where: { duenoId: req.usuario.id, rol, activo: true },
    }) || 0;

    if (totalActual + usosMaximos > maximoPlan) {
      return res.status(400).json({
        success: false,
        message: `Excede el límite de tu plan (máx ${maximoPlan} ${clave}). Actualizá a un plan superior.`,
      });
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
      duenoId: req.usuario.id,
      sucursalId: sucursalId || null,
    });

    res.status(201).json({
      success: true,
      data: nuevo,
      message: `Código ${codigo} generado exitosamente`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al generar código: ' + error.message });
  }
};

const revocar = async (req, res) => {
  try {
    const codigo = await CodigoInvitacion.findOne({
      where: { id: req.params.id, duenoId: req.usuario.id },
    });

    if (!codigo) {
      return res.status(404).json({ success: false, message: 'Código no encontrado' });
    }

    await codigo.update({ activo: false });

    res.json({
      success: true,
      data: codigo,
      message: `Código ${codigo.codigo} revocado`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al revocar código: ' + error.message });
  }
};

module.exports = { listar, generar, revocar };

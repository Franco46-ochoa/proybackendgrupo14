const { Sucursal, Usuario, Zona, CodigoInvitacion, Suscripcion } = require('../models');
const crypto = require('crypto');

const LIMITES = {
  basico: { sucursales: 3, gerentes: 3, empleados: 30 },
  pro: { sucursales: 10, gerentes: 10, empleados: 100 },
  enterprise: { sucursales: Infinity, gerentes: Infinity, empleados: Infinity },
};

const generarCodigoAleatorio = (rol) => {
  const hex = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `${rol === 'gerente' ? 'GER' : 'EMP'}-${hex}`;
};

const crearCodigoUnico = async (rol) => {
  for (let i = 0; i < 10; i++) {
    const codigo = generarCodigoAleatorio(rol);
    const existe = await CodigoInvitacion.findOne({ where: { codigo } });
    if (!existe) return codigo;
  }
  throw new Error('No se pudo generar un código único');
};

const sucursalController = {
  // GET /api/sucursales - Dueno/Admin: todas las suyas, Gerente: su zona, Empleado: su sucursal
  listar: async (req, res) => {
    try {
      const usuario = await Usuario.findByPk(req.usuario.id);

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      let result;
      if (usuario.rol === 'dueno') {
        result = await Sucursal.findAndCountAll({
          include: [{
            association: 'zona',
            attributes: ['id', 'nombre'],
            where: { empresaId: usuario.id },
          }],
          offset, limit,
          order: [['nombre', 'ASC']],
        });
      } else if (usuario.rol === 'administrador') {
        result = await Sucursal.findAndCountAll({
          include: [{
            association: 'zona',
            attributes: ['id', 'nombre'],
            where: { empresaId: usuario.empresaId },
          }],
          offset, limit,
          order: [['nombre', 'ASC']],
        });
      } else if (usuario.rol === 'gerente') {
        result = await Sucursal.findAndCountAll({
          where: { zonaId: usuario.zonaId },
          include: [{ association: 'zona', attributes: ['id', 'nombre'] }],
          offset, limit,
          order: [['nombre', 'ASC']],
        });
      } else {
        result = await Sucursal.findAndCountAll({
          where: { id: usuario.sucursalId },
          include: [{ association: 'zona', attributes: ['id', 'nombre'] }],
          offset, limit,
        });
      }

      const { count: total, rows: data } = result;

      res.json({
        success: true,
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al listar sucursales: ' + error.message,
      });
    }
  },

  // POST /api/sucursales - solo Dueno
  crear: async (req, res) => {
    try {
      const { nombre, direccion, lat, lng, telefono, zonaId, gerentesMax, empleadosMax } = req.body;

      if (!nombre || !nombre.trim()) {
        return res.status(400).json({ success: false, message: 'El nombre de la sucursal es obligatorio' });
      }

      if (!zonaId) {
        return res.status(400).json({ success: false, message: 'La zona es obligatoria' });
      }

      const gerentes = gerentesMax ? parseInt(gerentesMax) : 1;
      const empleados = empleadosMax ? parseInt(empleadosMax) : 10;

      // Validar límites del plan
      const suscripcion = await Suscripcion.findOne({
        where: { usuarioId: req.usuario.id, estado: 'activo' },
      });

      if (!suscripcion) {
        return res.status(400).json({
          success: false,
          message: 'No tenés una suscripción activa. Activá tu plan antes de crear sucursales.',
        });
      }

      const limite = LIMITES[suscripcion.plan];
      if (!limite) {
        return res.status(400).json({ success: false, message: 'Plan de suscripción no reconocido' });
      }

      // Validar cantidad de sucursales
      const sucursalesActuales = await Sucursal.count({
        include: [{ model: Zona, as: 'zona', where: { empresaId: req.usuario.id } }],
      });

      if (sucursalesActuales >= limite.sucursales) {
        return res.status(400).json({
          success: false,
          message: `Límite de sucursales alcanzado (${limite.sucursales} máx). Actualizá tu plan.`,
        });
      }

      // Validar gerentes
      const totalGerentes = await CodigoInvitacion.sum('usosMaximos', {
        where: { empresaId: req.usuario.id, rol: 'gerente', activo: true },
      }) || 0;

      if (totalGerentes + gerentes > limite.gerentes) {
        return res.status(400).json({
          success: false,
          message: `Excede el límite de gerentes (${limite.gerentes} máx). Actualizá a un plan superior.`,
        });
      }

      // Validar empleados
      const totalEmpleados = await CodigoInvitacion.sum('usosMaximos', {
        where: { empresaId: req.usuario.id, rol: 'empleado', activo: true },
      }) || 0;

      if (totalEmpleados + empleados > limite.empleados) {
        return res.status(400).json({
          success: false,
          message: `Excede el límite de empleados (${limite.empleados} máx). Actualizá a un plan superior.`,
        });
      }

      const sucursal = await Sucursal.create({
        nombre: nombre.trim(),
        direccion: direccion || null,
        lat: lat || null,
        lng: lng || null,
        telefono: telefono || null,
        zonaId,
      });

      // Auto-generar códigos vinculados a esta sucursal
      const codigoGER = await crearCodigoUnico('gerente');
      const codigoEMP = await crearCodigoUnico('empleado');

      const ger = await CodigoInvitacion.create({
        codigo: codigoGER, rol: 'gerente', usosMaximos: gerentes,
        empresaId: req.usuario.id, sucursalId: sucursal.id,
      });

      const emp = await CodigoInvitacion.create({
        codigo: codigoEMP, rol: 'empleado', usosMaximos: empleados,
        empresaId: req.usuario.id, sucursalId: sucursal.id,
      });

      res.status(201).json({
        success: true,
        data: {
          sucursal,
          codigos: {
            gerente: ger.codigo,
            empleado: emp.codigo,
          },
        },
        message: 'Sucursal creada con 2 códigos de invitación',
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al crear sucursal: ' + error.message });
    }
  },

  // PUT /api/sucursales/:id - solo Dueno
  actualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre, direccion, lat, lng, telefono, zonaId } = req.body;

      const sucursal = await Sucursal.findByPk(id);
      if (!sucursal) {
        return res.status(404).json({
          success: false,
          message: 'Sucursal no encontrada',
        });
      }

      await sucursal.update({
        nombre: nombre !== undefined ? nombre : sucursal.nombre,
        direccion: direccion !== undefined ? direccion : sucursal.direccion,
        lat: lat !== undefined ? lat : sucursal.lat,
        lng: lng !== undefined ? lng : sucursal.lng,
        telefono: telefono !== undefined ? telefono : sucursal.telefono,
        zonaId: zonaId !== undefined ? zonaId : sucursal.zonaId,
      });

      res.json({
        success: true,
        data: sucursal,
        message: 'Sucursal actualizada exitosamente',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al actualizar sucursal: ' + error.message,
      });
    }
  },

  // DELETE /api/sucursales/:id - solo Dueno
  eliminar: async (req, res) => {
    try {
      const { id } = req.params;

      const sucursal = await Sucursal.findByPk(id);
      if (!sucursal) {
        return res.status(404).json({
          success: false,
          message: 'Sucursal no encontrada',
        });
      }

      await sucursal.destroy();

      res.json({
        success: true,
        data: { id: parseInt(id) },
        message: 'Sucursal eliminada exitosamente',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al eliminar sucursal: ' + error.message,
      });
    }
  },
};

module.exports = sucursalController;

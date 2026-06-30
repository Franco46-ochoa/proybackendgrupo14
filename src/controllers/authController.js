const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Usuario, CodigoInvitacion } = require('../models');

const authController = {
  // POST /api/auth/register
  register: async (req, res) => {
    try {
      const { nombre, email, password, rol, sector, codigoInvitacion } = req.body;

      const existente = await Usuario.findOne({ where: { email } });
      if (existente) {
        return res.status(400).json({
          success: false,
          message: 'El email ya está registrado',
        });
      }

      // Validar código de invitación si el rol no es dueño
      let sucursalId = null;
      let zonaId = null;

      if (rol && rol !== 'dueno') {
        if (!codigoInvitacion) {
          return res.status(400).json({
            success: false,
            message: 'Código de invitación requerido para gerentes y empleados',
          });
        }

        const codigo = await CodigoInvitacion.findOne({
          where: { codigo: codigoInvitacion, activo: true },
        });

        if (!codigo) {
          return res.status(400).json({
            success: false,
            message: 'Código de invitación inválido',
          });
        }

        if (codigo.rol !== rol) {
          return res.status(400).json({
            success: false,
            message: 'Este código no corresponde al rol seleccionado',
          });
        }

        if (codigo.usosRealizados >= codigo.usosMaximos) {
          return res.status(400).json({
            success: false,
            message: 'Este código ya alcanzó el límite de registros',
          });
        }

        await codigo.update({ usosRealizados: codigo.usosRealizados + 1 });
        sucursalId = codigo.sucursalId || null;

        if (rol === 'gerente' && sucursalId) {
          const { Sucursal } = require('../models');
          const sucursal = await Sucursal.findByPk(sucursalId);
          if (sucursal) zonaId = sucursal.zonaId;
        }
      }

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      const usuario = await Usuario.create({
        nombre,
        email,
        password: hash,
        rol: rol || 'empleado',
        sector: sector || null,
        sucursalId,
        zonaId,
      });

      const token = jwt.sign(
        { id: usuario.id, rol: usuario.rol },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(201).json({
        success: true,
        data: {
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.email,
          rol: usuario.rol,
          sucursalId: usuario.sucursalId,
        },
        token,
        message: 'Usuario registrado exitosamente',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al registrar: ' + error.message,
      });
    }
  },

  // POST /api/auth/login
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const usuario = await Usuario.findOne({ where: { email } });
      if (!usuario) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales invalidas',
        });
      }

      if (!usuario.activo) {
        return res.status(403).json({
          success: false,
          message: 'Usuario desactivado',
        });
      }

      const validPassword = await bcrypt.compare(password, usuario.password);
      if (!validPassword) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales invalidas',
        });
      }

      const token = jwt.sign(
        { id: usuario.id, rol: usuario.rol },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        success: true,
        data: {
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.email,
          rol: usuario.rol,
        },
        token,
        message: 'Login exitoso',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al login: ' + error.message,
      });
    }
  },

  // GET /api/auth/profile
  profile: async (req, res) => {
    try {
      const usuario = await Usuario.findByPk(req.usuario.id, {
        attributes: { exclude: ['password', 'googleId'] },
        include: [
          { association: 'zona', attributes: ['id', 'nombre'] },
          { association: 'sucursal', attributes: ['id', 'nombre'] },
        ],
      });

      if (!usuario) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado',
        });
      }

      res.json({
        success: true,
        data: usuario,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener perfil: ' + error.message,
      });
    }
  },
};

module.exports = authController;

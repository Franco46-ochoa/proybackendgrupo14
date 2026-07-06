const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Usuario, CodigoInvitacion } = require("../models");
const { verificarTokenGoogle, encontrarOCrearUsuario } = require("../services/googleOAuth.service");

const authController = {
  // POST /api/auth/register
  register: async (req, res) => {
    try {
      const { nombre, apellido, email, password, rol, sector, codigoInvitacion } =
        req.body;

      const existente = await Usuario.findOne({ where: { email } });
      if (existente) {
        return res.status(400).json({
          success: false,
          message: "El email ya está registrado",
        });
      }

      // Validar código de invitación si el rol no es dueño
      let sucursalId = null;
      let zonaId = null;
      let empresaId = null;
      let departamento = null; // ◄ Inicializamos el campo departamento

      if (rol && rol !== "dueno") {
        if (!codigoInvitacion) {
          return res.status(400).json({
            success: false,
            message:
              "Código de invitación requerido para administradores, gerentes y empleados",
          });
        }

        const codigo = await CodigoInvitacion.findOne({
          where: { codigo: codigoInvitacion, activo: true },
        });

        if (!codigo) {
          return res.status(400).json({
            success: false,
            message: "Código de invitación inválido o inactivo",
          });
        }

        if (codigo.rol !== rol) {
          return res.status(400).json({
            success: false,
            message: `El código ingresado corresponde al rol ${codigo.rol}, no al rol solicitado ${rol}`,
          });
        }

        // Asignamos las dependencias estructurales directo desde el código usado
        sucursalId = codigo.sucursalId;
        zonaId = codigo.zonaId || null;
        empresaId = codigo.empresaId; // Vinculación automática a la empresa
        departamento = codigo.departamento; // ◄ Heredamos el departamento comercial/operativo asignado al código
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      // Creamos el usuario persistiendo los nuevos campos
      const nuevoUsuario = await Usuario.create({
        nombre,
        apellido,
        email,
        password: hashedPassword,
        rol,
        sector,
        sucursalId,
        zonaId,
        empresaId, // Fijado de consistencia multitenant
        departamento, // ◄ Persistencia en PostgreSQL (ENUM 'comercial' o 'operativo')
      });

      // Si el código era de un solo uso o alcanzó su límite, podrías decrementar usos aquí (opcional)

      res.status(201).json({
        success: true,
        data: {
          id: nuevoUsuario.id,
          nombre: nuevoUsuario.nombre,
          apellido: nuevoUsuario.apellido,
          email: nuevoUsuario.email,
          rol: nuevoUsuario.rol,
          departamento: nuevoUsuario.departamento,
        },
        message: "Usuario registrado con éxito",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al registrar usuario: " + error.message,
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
          message: "Credenciales inválidas (Email incorrecto)",
        });
      }

      const passwordCorrecto = await bcrypt.compare(password, usuario.password);
      if (!passwordCorrecto) {
        return res.status(401).json({
          success: false,
          message: "Credenciales inválidas (Contraseña incorrecta)",
        });
      }

      // ◄ MODIFICACIÓN CRÍTICA JWT: Inyectamos empresaId y departamento en el Payload
      // Si el usuario es dueño, su empresaId es su propio ID
      const payloadEmpresaId =
        usuario.rol === "dueno" ? usuario.id : usuario.empresaId;

      const token = jwt.sign(
        {
          id: usuario.id,
          rol: usuario.rol,
          empresaId: payloadEmpresaId, // Requerido por el orquestador y controladores
          departamento: usuario.departamento, // Requerido por verifyDepartamento
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" },
      );

      res.json({
        success: true,
        data: {
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.email,
          rol: usuario.rol,
          departamento: usuario.departamento,
          empresaId: payloadEmpresaId,
        },
        token,
        message: "Login exitoso",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al login: " + error.message,
      });
    }
  },

  // GET /api/auth/profile
  profile: async (req, res) => {
    try {
      const usuario = await Usuario.findByPk(req.usuario.id, {
        attributes: { exclude: ["password", "googleId"] },
        include: [
          { association: "zona", attributes: ["id", "nombre"] },
          { association: "sucursal", attributes: ["id", "nombre"] },
          {
            association: "suscripcion",
            attributes: ["id", "plan", "estado", "monto"],
          },
        ],
      });

      if (!usuario) {
        return res.status(404).json({
          success: false,
          message: "Usuario no encontrado",
        });
      }

      res.json({
        success: true,
        data: usuario,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener perfil: " + error.message,
      });
    }
  },

  // POST /api/auth/google
  googleLogin: async (req, res) => {
    try {
      const { token } = req.body;

      if (!token) {
        return res.status(400).json({
          success: false,
          message: "Token de Google requerido",
        });
      }

      const { codigoInvitacion } = req.body;
      const googleData = await verificarTokenGoogle(token);
      const usuario = await encontrarOCrearUsuario(googleData, codigoInvitacion);

      const payloadEmpresaId =
        usuario.rol === "dueno" ? usuario.id : usuario.empresaId;

      const jwtToken = jwt.sign(
        {
          id: usuario.id,
          rol: usuario.rol,
          empresaId: payloadEmpresaId,
          departamento: usuario.departamento,
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      res.json({
        success: true,
        data: {
          id: usuario.id,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          email: usuario.email,
          rol: usuario.rol,
          departamento: usuario.departamento,
          empresaId: payloadEmpresaId,
        },
        token: jwtToken,
        message: "Login con Google exitoso",
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: "Error al autenticar con Google: " + error.message,
      });
    }
  },
};

module.exports = authController;

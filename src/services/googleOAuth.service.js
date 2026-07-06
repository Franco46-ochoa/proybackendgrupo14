// Integración con Google OAuth 2.0
const { OAuth2Client } = require('google-auth-library');
const { Usuario } = require('../models');

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

/**
 * Valida un token de Google ID y devuelve los datos del usuario.
 */
const verificarTokenGoogle = async (token) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: GOOGLE_CLIENT_ID,
  });
  return ticket.getPayload(); // { sub, email, name, picture }
};

/**
 * Busca o crea un usuario a partir de los datos de Google.
 */
const encontrarOCrearUsuario = async (googleData) => {
  const [usuario] = await Usuario.findOrCreate({
    where: { googleId: googleData.sub },
    defaults: {
      nombre: googleData.name,
      email: googleData.email,
      password: 'google-oauth-' + googleData.sub, // nunca se usa para login
      rol: 'empleado',
    }
  });
  return usuario;
};

module.exports = { verificarTokenGoogle, encontrarOCrearUsuario };

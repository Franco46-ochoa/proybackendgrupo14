// Sprint 2: Integración con Google OAuth 2.0
// Documentación: https://developers.google.com/identity/protocols/oauth2

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

/**
 * Valida un token de Google ID y devuelve los datos del usuario.
 * Sprint 2: usar google-auth-library (verifyIdToken)
 */
const verificarTokenGoogle = async (token) => {
  throw new Error("No implementado — Sprint 2");
  // Sprint 2:
  // const { OAuth2Client } = require('google-auth-library');
  // const client = new OAuth2Client(GOOGLE_CLIENT_ID);
  // const ticket = await client.verifyIdToken({ idToken: token, audience: GOOGLE_CLIENT_ID });
  // return ticket.getPayload(); // { sub, email, name, picture }
};

/**
 * Busca o crea un usuario a partir de los datos de Google.
 * Sprint 2: usar Usuario.findOrCreate({ where: { googleId } })
 */
const encontrarOCrearUsuario = async (googleData) => {
  throw new Error("No implementado — Sprint 2");
  // Sprint 2:
  // const { Usuario } = require('../models');
  // const [usuario] = await Usuario.findOrCreate({
  //   where: { googleId: googleData.sub },
  //   defaults: { nombre: googleData.name, email: googleData.email, rol: 'empleado' }
  // });
  // return usuario;
};

module.exports = { verificarTokenGoogle, encontrarOCrearUsuario };

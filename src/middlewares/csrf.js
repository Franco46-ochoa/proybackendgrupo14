const csrf = require('csurf');

const csrfProtection = csrf({ cookie: true });

// Rutas exentas de CSRF (publicas o que no usan body)
const CSRF_EXEMPT = [
  '/api/auth/register',
  '/api/auth/login',
];

const csrfMiddleware = (req, res, next) => {
  if (CSRF_EXEMPT.includes(req.path)) return next();
  csrfProtection(req, res, next);
};

module.exports = csrfMiddleware;

const crypto = require('crypto');

const CSRF_COOKIE_NAME = 'XSRF-TOKEN';
const CSRF_HEADER_NAME = 'x-xsrf-token';

const parseCookies = (cookieHeader) => {
  return cookieHeader
    ? cookieHeader.split(';').reduce((cookies, item) => {
        const [key, value] = item.split('=').map((part) => part.trim());
        if (key && value) {
          cookies[key] = decodeURIComponent(value);
        }
        return cookies;
      }, {})
    : {};
};

const CSRF_WHITELIST = [
  '/api/pagos/webhook',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/google',
];

function csrfProtection() {
  return (req, res, next) => {
    const method = req.method.toUpperCase();
    const authHeader = req.headers.authorization;
    const path = req.path;
    const isSafeMethod = ['GET', 'HEAD', 'OPTIONS'].includes(method);

    if (isSafeMethod || CSRF_WHITELIST.includes(path)) {
      const cookies = parseCookies(req.headers.cookie);
      const token = cookies[CSRF_COOKIE_NAME] || crypto.randomBytes(16).toString('hex');
      res.cookie(CSRF_COOKIE_NAME, token, {
        httpOnly: false,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
      });
      return next();
    }

    if (authHeader && authHeader.startsWith('Bearer ')) {
      return next();
    }

    const cookies = parseCookies(req.headers.cookie);
    const cookieToken = cookies[CSRF_COOKIE_NAME];
    const headerToken = req.headers[CSRF_HEADER_NAME];

    if (!cookieToken || !headerToken || cookieToken !== headerToken) {
      return res.status(403).json({
        success: false,
        message: 'CSRF token inválido o ausente',
      });
    }

    next();
  };
}

module.exports = csrfProtection;

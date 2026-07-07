const crypto = require("crypto");

const CSRF_EXEMPT = [
  "/api/auth/register",
  "/api/auth/login",
  "/api/suscripciones",
  "/api/mp",
];

const csrfMiddleware = (req, res, next) => {
  const fullPath = req.originalUrl || req.url;
  if (CSRF_EXEMPT.some((exempt) => fullPath.startsWith(exempt))) {
    return next();
  }

  if (req.method === "GET") {
    let token = req.cookies?.["XSRF-TOKEN"];
    if (!token) {
      token = crypto.randomBytes(32).toString("hex");
    }
    res.cookie("XSRF-TOKEN", token, {
      httpOnly: false,
      sameSite: 'none',
      secure: true,
      path: "/",
    });
    req.csrfToken = token;
    return next();
  }

  if (["POST", "PUT", "DELETE", "PATCH"].includes(req.method)) {
    const headerToken = req.headers["x-xsrf-token"];
    const cookieToken = req.cookies?.["XSRF-TOKEN"];

    if (!headerToken || !cookieToken || headerToken !== cookieToken) {
      return res.status(403).json({
        success: false,
        message: "CSRF token invalido o no proporcionado",
      });
    }
  }

  next();
};

module.exports = csrfMiddleware;

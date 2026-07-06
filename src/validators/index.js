const { body, param, query, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Error de validacion',
      errors: errors.array().map(e => ({ campo: e.path, mensaje: e.msg })),
    });
  }
  next();
};

// ─── Auth ─────────────────────────────────────────────────
const authRegister = [
  body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio'),
  body('email').trim().isEmail().withMessage('Email invalido'),
  body('password').isLength({ min: 6 }).withMessage('La contrasena debe tener al menos 6 caracteres'),
  body('rol').optional().isIn(['dueno', 'gerente', 'empleado', 'administrador']).withMessage('Rol invalido'),
  body('sector').optional().isIn(['ventas', 'finanzas', 'stock']).withMessage('Sector invalido'),
  handleValidationErrors,
];

const authLogin = [
  body('email').trim().isEmail().withMessage('Email invalido'),
  body('password').notEmpty().withMessage('La contrasena es obligatoria'),
  handleValidationErrors,
];

// ─── Usuario ───────────────────────────────────────────────
const usuarioCrear = [
  body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio'),
  body('email').trim().isEmail().withMessage('Email invalido'),
  body('password').isLength({ min: 6 }).withMessage('La contrasena debe tener al menos 6 caracteres'),
  body('rol').optional().isIn(['dueno', 'gerente', 'empleado', 'administrador']).withMessage('Rol invalido'),
  body('sector').optional().isIn(['ventas', 'finanzas', 'stock']).withMessage('Sector invalido'),
  body('zonaId').optional({ values: 'null' }).isInt({ min: 1 }).withMessage('zonaId debe ser un entero positivo'),
  body('sucursalId').optional({ values: 'null' }).isInt({ min: 1 }).withMessage('sucursalId debe ser un entero positivo'),
  handleValidationErrors,
];

const usuarioActualizar = [
  param('id').isInt({ min: 1 }).withMessage('ID invalido'),
  body('nombre').optional().trim().notEmpty().withMessage('El nombre no puede estar vacio'),
  body('email').optional().trim().isEmail().withMessage('Email invalido'),
  body('rol').optional().isIn(['dueno', 'gerente', 'empleado', 'administrador']).withMessage('Rol invalido'),
  body('sector').optional({ values: 'null' }).isIn(['ventas', 'finanzas', 'stock']).withMessage('Sector invalido'),
  body('zonaId').optional({ values: 'null' }).isInt({ min: 1 }).withMessage('zonaId debe ser un entero positivo'),
  body('sucursalId').optional({ values: 'null' }).isInt({ min: 1 }).withMessage('sucursalId debe ser un entero positivo'),
  handleValidationErrors,
];

const usuarioDesactivar = [
  param('id').isInt({ min: 1 }).withMessage('ID invalido'),
  handleValidationErrors,
];

// ─── Zona ──────────────────────────────────────────────────
const zonaCrear = [
  body('nombre').trim().notEmpty().withMessage('El nombre de la zona es obligatorio'),
  handleValidationErrors,
];

const zonaActualizar = [
  param('id').isInt({ min: 1 }).withMessage('ID invalido'),
  body('nombre').trim().notEmpty().withMessage('El nombre de la zona es obligatorio'),
  handleValidationErrors,
];

const zonaEliminar = [
  param('id').isInt({ min: 1 }).withMessage('ID invalido'),
  handleValidationErrors,
];

// ─── Sucursal ──────────────────────────────────────────────
const sucursalCrear = [
  body('nombre').trim().notEmpty().withMessage('El nombre de la sucursal es obligatorio'),
  body('direccion').optional().trim().notEmpty().withMessage('La direccion no puede estar vacia'),
  body('lat').optional({ values: 'null' }).isFloat().withMessage('lat debe ser un numero decimal'),
  body('lng').optional({ values: 'null' }).isFloat().withMessage('lng debe ser un numero decimal'),
  body('telefono').optional().trim().notEmpty().withMessage('El telefono no puede estar vacio'),
  body('zonaId').isInt({ min: 1 }).withMessage('La zona es obligatoria (debe ser un entero positivo)'),
  handleValidationErrors,
];

const sucursalActualizar = [
  param('id').isInt({ min: 1 }).withMessage('ID invalido'),
  body('nombre').optional().trim().notEmpty().withMessage('El nombre no puede estar vacio'),
  body('direccion').optional({ values: 'null' }).trim().notEmpty().withMessage('La direccion no puede estar vacia'),
  body('lat').optional({ values: 'null' }).isFloat().withMessage('lat debe ser un numero decimal'),
  body('lng').optional({ values: 'null' }).isFloat().withMessage('lng debe ser un numero decimal'),
  body('telefono').optional({ values: 'null' }).trim().notEmpty().withMessage('El telefono no puede estar vacio'),
  body('zonaId').optional().isInt({ min: 1 }).withMessage('zonaId debe ser un entero positivo'),
  handleValidationErrors,
];

const sucursalEliminar = [
  param('id').isInt({ min: 1 }).withMessage('ID invalido'),
  handleValidationErrors,
];

// ─── Producto ──────────────────────────────────────────────
const productoCrear = [
  body('nombre').trim().notEmpty().withMessage('El nombre del producto es obligatorio'),
  body('codigo').trim().notEmpty().withMessage('El codigo del producto es obligatorio'),
  body('categoria').optional().trim().notEmpty().withMessage('La categoria no puede estar vacia'),
  body('descripcion').optional().trim().notEmpty().withMessage('La descripcion no puede estar vacia'),
  body('precioCompra').isFloat({ min: 0.01 }).withMessage('El precio de compra debe ser un numero positivo'),
  body('unidadMedida').optional().trim().notEmpty().withMessage('La unidad de medida no puede estar vacia'),
  handleValidationErrors,
];

const productoActualizar = [
  param('id').isInt({ min: 1 }).withMessage('ID invalido'),
  body('nombre').optional().trim().notEmpty().withMessage('El nombre no puede estar vacio'),
  body('codigo').optional().trim().notEmpty().withMessage('El codigo no puede estar vacio'),
  body('categoria').optional({ values: 'null' }).trim().notEmpty().withMessage('La categoria no puede estar vacia'),
  body('descripcion').optional({ values: 'null' }).trim().notEmpty().withMessage('La descripcion no puede estar vacia'),
  body('precioCompra').optional().isFloat({ min: 0.01 }).withMessage('El precio de compra debe ser un numero positivo'),
  body('unidadMedida').optional().trim().notEmpty().withMessage('La unidad de medida no puede estar vacia'),
  body('activo').optional().isBoolean().withMessage('activo debe ser booleano'),
  handleValidationErrors,
];

const productoEliminar = [
  param('id').isInt({ min: 1 }).withMessage('ID invalido'),
  handleValidationErrors,
];

// ─── Inventario ────────────────────────────────────────────
const inventarioCrear = [
  body('productoId').isInt({ min: 1 }).withMessage('El producto es obligatorio (debe ser un entero positivo)'),
  body('sucursalId').isInt({ min: 1 }).withMessage('La sucursal es obligatoria (debe ser un entero positivo)'),
  body('stockActual').isInt({ min: 0 }).withMessage('El stock actual debe ser un entero >= 0'),
  body('stockMinimo').isInt({ min: 0 }).withMessage('El stock minimo debe ser un entero >= 0'),
  body('stockMaximo').optional({ values: 'null' }).isInt({ min: 0 }).withMessage('stockMaximo debe ser un entero >= 0'),
  body('precioVenta').isFloat({ min: 0.01 }).withMessage('El precio de venta debe ser un numero positivo'),
  handleValidationErrors,
];

const inventarioActualizar = [
  param('id').isInt({ min: 1 }).withMessage('ID invalido'),
  body('stockActual').optional().isInt({ min: 0 }).withMessage('El stock actual debe ser un entero >= 0'),
  body('stockMinimo').optional().isInt({ min: 0 }).withMessage('El stock minimo debe ser un entero >= 0'),
  body('stockMaximo').optional({ values: 'null' }).isInt({ min: 0 }).withMessage('stockMaximo debe ser un entero >= 0'),
  body('precioVenta').optional().isFloat({ min: 0.01 }).withMessage('El precio de venta debe ser un numero positivo'),
  handleValidationErrors,
];

const inventarioEliminar = [
  param('id').isInt({ min: 1 }).withMessage('ID invalido'),
  handleValidationErrors,
];

// ─── Transaccion ───────────────────────────────────────────
const transaccionCrear = [
  body('tipo').isIn(['venta', 'compra']).withMessage('El tipo debe ser venta o compra'),
  body('cantidad').isInt({ min: 1 }).withMessage('La cantidad debe ser un entero positivo'),
  body('precioUnitario').isFloat({ min: 0.01 }).withMessage('El precio unitario debe ser un numero positivo'),
  body('productoId').isInt({ min: 1 }).withMessage('El producto es obligatorio'),
  body('sucursalId').isInt({ min: 1 }).withMessage('La sucursal es obligatoria'),
  body('fecha').optional().isISO8601().withMessage('Fecha invalida (use ISO8601)'),
  body('observaciones').optional().trim().notEmpty().withMessage('Las observaciones no pueden estar vacias'),
  handleValidationErrors,
];

const transaccionActualizar = [
  param('id').isInt({ min: 1 }).withMessage('ID invalido'),
  body('tipo').optional().isIn(['venta', 'compra']).withMessage('El tipo debe ser venta o compra'),
  body('cantidad').optional().isInt({ min: 1 }).withMessage('La cantidad debe ser un entero positivo'),
  body('precioUnitario').optional().isFloat({ min: 0.01 }).withMessage('El precio unitario debe ser un numero positivo'),
  body('productoId').optional().isInt({ min: 1 }).withMessage('productoId debe ser un entero positivo'),
  body('sucursalId').optional().isInt({ min: 1 }).withMessage('sucursalId debe ser un entero positivo'),
  body('fecha').optional({ values: 'null' }).isISO8601().withMessage('Fecha invalida (use ISO8601)'),
  body('observaciones').optional({ values: 'null' }).trim().notEmpty().withMessage('Las observaciones no pueden estar vacias'),
  handleValidationErrors,
];

const transaccionEliminar = [
  param('id').isInt({ min: 1 }).withMessage('ID invalido'),
  handleValidationErrors,
];

// ─── Gasto ─────────────────────────────────────────────────
const gastoCrear = [
  body('tipo').trim().notEmpty().withMessage('El tipo de gasto es obligatorio'),
  body('monto').isFloat({ min: 0.01 }).withMessage('El monto debe ser un numero positivo'),
  body('descripcion').optional().trim().notEmpty().withMessage('La descripcion no puede estar vacia'),
  body('fecha').optional().isISO8601().withMessage('Fecha invalida (use ISO8601)'),
  body('proveedorId').optional({ values: 'null' }).isInt({ min: 1 }).withMessage('proveedorId debe ser un entero positivo'),
  body('sucursalId').isInt({ min: 1 }).withMessage('La sucursal es obligatoria'),
  handleValidationErrors,
];

const gastoActualizar = [
  param('id').isInt({ min: 1 }).withMessage('ID invalido'),
  body('tipo').optional().trim().notEmpty().withMessage('El tipo no puede estar vacio'),
  body('monto').optional().isFloat({ min: 0.01 }).withMessage('El monto debe ser un numero positivo'),
  body('descripcion').optional({ values: 'null' }).trim().notEmpty().withMessage('La descripcion no puede estar vacia'),
  body('fecha').optional({ values: 'null' }).isISO8601().withMessage('Fecha invalida (use ISO8601)'),
  body('proveedorId').optional({ values: 'null' }).isInt({ min: 1 }).withMessage('proveedorId debe ser un entero positivo'),
  body('sucursalId').optional().isInt({ min: 1 }).withMessage('sucursalId debe ser un entero positivo'),
  handleValidationErrors,
];

const gastoEliminar = [
  param('id').isInt({ min: 1 }).withMessage('ID invalido'),
  handleValidationErrors,
];

// ─── Proveedor ─────────────────────────────────────────────
const proveedorCrear = [
  body('nombre').trim().notEmpty().withMessage('El nombre del proveedor es obligatorio'),
  body('cuit').trim().notEmpty().withMessage('El CUIT es obligatorio'),
  body('contacto').optional().trim().notEmpty().withMessage('El contacto no puede estar vacio'),
  handleValidationErrors,
];

const proveedorActualizar = [
  param('id').isInt({ min: 1 }).withMessage('ID invalido'),
  body('nombre').optional().trim().notEmpty().withMessage('El nombre no puede estar vacio'),
  body('cuit').optional().trim().notEmpty().withMessage('El CUIT no puede estar vacio'),
  body('contacto').optional({ values: 'null' }).trim().notEmpty().withMessage('El contacto no puede estar vacio'),
  handleValidationErrors,
];

const proveedorEliminar = [
  param('id').isInt({ min: 1 }).withMessage('ID invalido'),
  handleValidationErrors,
];

module.exports = {
  handleValidationErrors,
  authRegister,
  authLogin,
  usuarioCrear,
  usuarioActualizar,
  usuarioDesactivar,
  zonaCrear,
  zonaActualizar,
  zonaEliminar,
  sucursalCrear,
  sucursalActualizar,
  sucursalEliminar,
  productoCrear,
  productoActualizar,
  productoEliminar,
  inventarioCrear,
  inventarioActualizar,
  inventarioEliminar,
  transaccionCrear,
  transaccionActualizar,
  transaccionEliminar,
  gastoCrear,
  gastoActualizar,
  gastoEliminar,
  proveedorCrear,
  proveedorActualizar,
  proveedorEliminar,
};

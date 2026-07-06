const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');
const authJWT = require('../middlewares/authJWT');
const verifyRole = require('../middlewares/verifyRole');
const auditLog = require('../middlewares/auditLog');
const { crearProductoValidator, actualizarProductoValidator } = require('../middlewares/validators');

router.get('/', authJWT, verifyRole('dueno', 'gerente', 'empleado'), productoController.listar);
router.post('/', authJWT, verifyRole('dueno', 'gerente', 'empleado'), crearProductoValidator, auditLog(), productoController.crear);
router.put('/:id', authJWT, verifyRole('dueno', 'gerente', 'empleado'), actualizarProductoValidator, auditLog(), productoController.actualizar);
router.delete('/:id', authJWT, verifyRole('dueno', 'gerente'), auditLog(), productoController.eliminar);

module.exports = router;

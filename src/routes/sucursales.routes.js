const express = require('express');
const router = express.Router();
const sucursalController = require('../controllers/sucursalController');
const authJWT = require('../middlewares/authJWT');
const verifyRole = require('../middlewares/verifyRole');
const auditLog = require('../middlewares/auditLog');
const { crearSucursalValidator, actualizarSucursalValidator } = require('../middlewares/validators');

router.get('/', authJWT, verifyRole('dueno', 'administrador', 'gerente', 'empleado'), sucursalController.listar);
router.post('/', authJWT, verifyRole('dueno'), crearSucursalValidator, auditLog(), sucursalController.crear);
router.put('/:id', authJWT, verifyRole('dueno'), actualizarSucursalValidator, auditLog(), sucursalController.actualizar);
router.delete('/:id', authJWT, verifyRole('dueno'), auditLog(), sucursalController.eliminar);

module.exports = router;

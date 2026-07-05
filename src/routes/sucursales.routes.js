const express = require('express');
const router = express.Router();
const sucursalController = require('../controllers/sucursalController');
const authJWT = require('../middlewares/authJWT');
const verifyRole = require('../middlewares/verifyRole');
const validators = require('../validators');
const auditLog = require('../middlewares/auditLog');

router.get('/', authJWT, verifyRole('dueno', 'gerente', 'empleado'), sucursalController.listar);
router.post('/', authJWT, verifyRole('dueno'), validators.sucursalCrear, auditLog('sucursales'), sucursalController.crear);
router.put('/:id', authJWT, verifyRole('dueno'), validators.sucursalActualizar, auditLog('sucursales'), sucursalController.actualizar);
router.delete('/:id', authJWT, verifyRole('dueno'), validators.sucursalEliminar, auditLog('sucursales'), sucursalController.eliminar);

module.exports = router;

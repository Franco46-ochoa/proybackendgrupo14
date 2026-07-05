const express = require('express');
const router = express.Router();
const transaccionController = require('../controllers/transaccionController');
const authJWT = require('../middlewares/authJWT');
const verifyRole = require('../middlewares/verifyRole');
const validators = require('../validators');
const auditLog = require('../middlewares/auditLog');

router.get('/', authJWT, verifyRole('dueno', 'gerente', 'empleado'), transaccionController.listar);
router.post('/', authJWT, verifyRole('dueno', 'gerente', 'empleado'), validators.transaccionCrear, auditLog('transacciones'), transaccionController.crear);
router.put('/:id', authJWT, verifyRole('dueno', 'gerente', 'empleado'), validators.transaccionActualizar, auditLog('transacciones'), transaccionController.actualizar);
router.delete('/:id', authJWT, verifyRole('dueno', 'gerente'), validators.transaccionEliminar, auditLog('transacciones'), transaccionController.eliminar);

module.exports = router;

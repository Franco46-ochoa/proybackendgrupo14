const express = require('express');
const router = express.Router();
const proveedorController = require('../controllers/proveedorController');
const authJWT = require('../middlewares/authJWT');
const verifyRole = require('../middlewares/verifyRole');
const validators = require('../validators');
const auditLog = require('../middlewares/auditLog');

router.get('/', authJWT, verifyRole('dueno', 'gerente'), proveedorController.listar);
router.post('/', authJWT, verifyRole('dueno', 'gerente'), validators.proveedorCrear, auditLog('proveedores'), proveedorController.crear);
router.put('/:id', authJWT, verifyRole('dueno', 'gerente'), validators.proveedorActualizar, auditLog('proveedores'), proveedorController.actualizar);
router.delete('/:id', authJWT, verifyRole('dueno'), validators.proveedorEliminar, auditLog('proveedores'), proveedorController.eliminar);

module.exports = router;

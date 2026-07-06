const express = require('express');
const router = express.Router();
const proveedorController = require('../controllers/proveedorController');
const authJWT = require('../middlewares/authJWT');
const verifyRole = require('../middlewares/verifyRole');
const auditLog = require('../middlewares/auditLog');
const { crearProveedorValidator, actualizarProveedorValidator } = require('../middlewares/validators');

router.get('/', authJWT, verifyRole('dueno', 'gerente'), proveedorController.listar);
router.post('/', authJWT, verifyRole('dueno', 'gerente'), crearProveedorValidator, auditLog(), proveedorController.crear);
router.put('/:id', authJWT, verifyRole('dueno', 'gerente'), actualizarProveedorValidator, auditLog(), proveedorController.actualizar);
router.delete('/:id', authJWT, verifyRole('dueno'), auditLog(), proveedorController.eliminar);

module.exports = router;

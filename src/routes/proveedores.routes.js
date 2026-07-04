const express = require('express');
const router = express.Router();
const proveedorController = require('../controllers/proveedorController');
const authJWT = require('../middlewares/authJWT');
const verifyRole = require('../middlewares/verifyRole');
const validators = require('../validators');

router.get('/', authJWT, verifyRole('dueno', 'gerente'), proveedorController.listar);
router.post('/', authJWT, verifyRole('dueno', 'gerente'), validators.proveedorCrear, proveedorController.crear);
router.put('/:id', authJWT, verifyRole('dueno', 'gerente'), validators.proveedorActualizar, proveedorController.actualizar);
router.delete('/:id', authJWT, verifyRole('dueno'), validators.proveedorEliminar, proveedorController.eliminar);

module.exports = router;

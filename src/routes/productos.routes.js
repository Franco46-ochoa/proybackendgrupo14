const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');
const authJWT = require('../middlewares/authJWT');
const verifyRole = require('../middlewares/verifyRole');
const validators = require('../validators');

router.get('/', authJWT, verifyRole('dueno', 'gerente', 'empleado'), productoController.listar);
router.post('/', authJWT, verifyRole('dueno', 'gerente', 'empleado'), validators.productoCrear, productoController.crear);
router.put('/:id', authJWT, verifyRole('dueno', 'gerente', 'empleado'), validators.productoActualizar, productoController.actualizar);
router.delete('/:id', authJWT, verifyRole('dueno', 'gerente'), validators.productoEliminar, productoController.eliminar);

module.exports = router;

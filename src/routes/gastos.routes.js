const express = require('express');
const router = express.Router();
const gastoController = require('../controllers/gastoController');
const authJWT = require('../middlewares/authJWT');
const verifyRole = require('../middlewares/verifyRole');
const validators = require('../validators');

router.get('/', authJWT, verifyRole('dueno', 'gerente', 'empleado'), gastoController.listar);
router.post('/', authJWT, verifyRole('dueno', 'gerente', 'empleado'), validators.gastoCrear, gastoController.crear);
router.put('/:id', authJWT, verifyRole('dueno', 'gerente', 'empleado'), validators.gastoActualizar, gastoController.actualizar);
router.delete('/:id', authJWT, verifyRole('dueno', 'gerente'), validators.gastoEliminar, gastoController.eliminar);

module.exports = router;

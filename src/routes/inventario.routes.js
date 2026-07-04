const express = require('express');
const router = express.Router();
const inventarioController = require('../controllers/inventarioController');
const authJWT = require('../middlewares/authJWT');
const verifyRole = require('../middlewares/verifyRole');
const validators = require('../validators');

router.get('/', authJWT, verifyRole('dueno', 'gerente', 'empleado'), inventarioController.listar);
router.post('/', authJWT, verifyRole('dueno', 'gerente', 'empleado'), validators.inventarioCrear, inventarioController.crear);
router.put('/:id', authJWT, verifyRole('dueno', 'gerente', 'empleado'), validators.inventarioActualizar, inventarioController.actualizar);
router.delete('/:id', authJWT, verifyRole('dueno', 'gerente'), validators.inventarioEliminar, inventarioController.eliminar);

module.exports = router;

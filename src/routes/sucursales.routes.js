const express = require('express');
const router = express.Router();
const sucursalController = require('../controllers/sucursalController');
const authJWT = require('../middlewares/authJWT');
const verifyRole = require('../middlewares/verifyRole');
const validators = require('../validators');

router.get('/', authJWT, verifyRole('dueno', 'gerente', 'empleado'), sucursalController.listar);
router.post('/', authJWT, verifyRole('dueno'), validators.sucursalCrear, sucursalController.crear);
router.put('/:id', authJWT, verifyRole('dueno'), validators.sucursalActualizar, sucursalController.actualizar);
router.delete('/:id', authJWT, verifyRole('dueno'), validators.sucursalEliminar, sucursalController.eliminar);

module.exports = router;

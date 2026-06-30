const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');
const authJWT = require('../middlewares/authJWT');
const verifyRole = require('../middlewares/verifyRole');

router.get('/', authJWT, verifyRole('dueno', 'gerente', 'empleado'), productoController.listar);
router.post('/', authJWT, verifyRole('dueno', 'gerente', 'empleado'), productoController.crear);
router.put('/:id', authJWT, verifyRole('dueno', 'gerente', 'empleado'), productoController.actualizar);
router.delete('/:id', authJWT, verifyRole('dueno', 'gerente'), productoController.eliminar);

module.exports = router;

const express = require('express');
const router = express.Router();
const inventarioController = require('../controllers/inventarioController');
const authJWT = require('../middlewares/authJWT');
const verifyRole = require('../middlewares/verifyRole');

router.get('/', authJWT, verifyRole('dueno', 'gerente', 'empleado'), inventarioController.listar);
router.post('/', authJWT, verifyRole('dueno', 'gerente', 'empleado'), inventarioController.crear);
router.put('/:id', authJWT, verifyRole('dueno', 'gerente', 'empleado'), inventarioController.actualizar);
router.delete('/:id', authJWT, verifyRole('dueno', 'gerente'), inventarioController.eliminar);

module.exports = router;

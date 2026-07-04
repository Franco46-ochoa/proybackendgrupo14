const express = require('express');
const router = express.Router();
const transaccionController = require('../controllers/transaccionController');
const authJWT = require('../middlewares/authJWT');
const verifyRole = require('../middlewares/verifyRole');
const validators = require('../validators');

router.get('/', authJWT, verifyRole('dueno', 'gerente', 'empleado'), transaccionController.listar);
router.post('/', authJWT, verifyRole('dueno', 'gerente', 'empleado'), validators.transaccionCrear, transaccionController.crear);
router.put('/:id', authJWT, verifyRole('dueno', 'gerente', 'empleado'), validators.transaccionActualizar, transaccionController.actualizar);
router.delete('/:id', authJWT, verifyRole('dueno', 'gerente'), validators.transaccionEliminar, transaccionController.eliminar);

module.exports = router;

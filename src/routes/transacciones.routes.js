const express = require('express');
const router = express.Router();
const transaccionController = require('../controllers/transaccionController');
const authJWT = require('../middlewares/authJWT');
const verifyRole = require('../middlewares/verifyRole');

router.get('/', authJWT, verifyRole('dueno', 'gerente', 'empleado'), transaccionController.listar);
router.post('/', authJWT, verifyRole('dueno', 'gerente', 'empleado'), transaccionController.crear);
router.put('/:id', authJWT, verifyRole('dueno', 'gerente', 'empleado'), transaccionController.actualizar);
router.delete('/:id', authJWT, verifyRole('dueno', 'gerente'), transaccionController.eliminar);

module.exports = router;

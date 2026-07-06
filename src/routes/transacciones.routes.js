const express = require('express');
const router = express.Router();
const transaccionController = require('../controllers/transaccionController');
const authJWT = require('../middlewares/authJWT');
const verifyRole = require('../middlewares/verifyRole');
const { verifyDepartamentoTransaccion } = require('../middlewares/verifyDepartamento');
const auditLog = require('../middlewares/auditLog');
const { crearTransaccionValidator, actualizarTransaccionValidator } = require('../middlewares/validators');

router.get('/', authJWT, verifyRole('dueno', 'gerente', 'empleado'), transaccionController.listar);
router.post(
  '/',
  authJWT,
  verifyRole('dueno', 'gerente', 'empleado'),
  verifyDepartamentoTransaccion(),
  crearTransaccionValidator,
  auditLog(),
  transaccionController.crear,
);
router.put(
  '/:id',
  authJWT,
  verifyRole('dueno', 'gerente', 'empleado'),
  verifyDepartamentoTransaccion(),
  actualizarTransaccionValidator,
  auditLog(),
  transaccionController.actualizar,
);
router.delete('/:id', authJWT, verifyRole('dueno', 'gerente'), auditLog(), transaccionController.eliminar);

module.exports = router;

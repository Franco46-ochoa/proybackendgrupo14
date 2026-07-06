const express = require('express');
const router = express.Router();
const gastoController = require('../controllers/gastoController');
const authJWT = require('../middlewares/authJWT');
const verifyRole = require('../middlewares/verifyRole');
const { verifyDepartamento } = require('../middlewares/verifyDepartamento');
const auditLog = require('../middlewares/auditLog');
const { crearGastoValidator, actualizarGastoValidator } = require('../middlewares/validators');

router.get('/', authJWT, verifyRole('dueno', 'gerente', 'empleado'), gastoController.listar);
router.post(
  '/',
  authJWT,
  verifyRole('dueno', 'gerente', 'empleado'),
  verifyDepartamento('operativo'),
  crearGastoValidator,
  auditLog(),
  gastoController.crear,
);
router.put(
  '/:id',
  authJWT,
  verifyRole('dueno', 'gerente', 'empleado'),
  verifyDepartamento('operativo'),
  actualizarGastoValidator,
  auditLog(),
  gastoController.actualizar,
);
router.delete('/:id', authJWT, verifyRole('dueno', 'gerente'), auditLog(), gastoController.eliminar);

module.exports = router;

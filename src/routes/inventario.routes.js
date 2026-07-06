const express = require('express');
const router = express.Router();
const inventarioController = require('../controllers/inventarioController');
const authJWT = require('../middlewares/authJWT');
const verifyRole = require('../middlewares/verifyRole');
const { verifyDepartamento } = require('../middlewares/verifyDepartamento');
const auditLog = require('../middlewares/auditLog');
const { crearInventarioValidator, actualizarInventarioValidator } = require('../middlewares/validators');

router.get('/', authJWT, verifyRole('dueno', 'gerente', 'empleado'), inventarioController.listar);
router.post(
  '/',
  authJWT,
  verifyRole('dueno', 'gerente', 'empleado'),
  verifyDepartamento('operativo'),
  crearInventarioValidator,
  auditLog(),
  inventarioController.crear,
);
router.put(
  '/:id',
  authJWT,
  verifyRole('dueno', 'gerente', 'empleado'),
  verifyDepartamento('operativo'),
  actualizarInventarioValidator,
  auditLog(),
  inventarioController.actualizar,
);
router.delete('/:id', authJWT, verifyRole('dueno', 'gerente'), auditLog(), inventarioController.eliminar);

module.exports = router;

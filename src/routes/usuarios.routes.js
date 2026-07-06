const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const authJWT = require('../middlewares/authJWT');
const verifyRole = require('../middlewares/verifyRole');
const auditLog = require('../middlewares/auditLog');
const { crearUsuarioValidator, actualizarUsuarioValidator } = require('../middlewares/validators');

router.get('/', authJWT, verifyRole('dueno'), usuarioController.listar);
router.post('/', authJWT, verifyRole('dueno'), crearUsuarioValidator, auditLog(), usuarioController.crear);
router.put('/:id', authJWT, verifyRole('dueno'), actualizarUsuarioValidator, auditLog(), usuarioController.actualizar);
router.delete('/:id', authJWT, verifyRole('dueno'), auditLog(), usuarioController.desactivar);

module.exports = router;

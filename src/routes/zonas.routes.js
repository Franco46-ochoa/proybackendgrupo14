const express = require('express');
const router = express.Router();
const zonaController = require('../controllers/zonaController');
const authJWT = require('../middlewares/authJWT');
const verifyRole = require('../middlewares/verifyRole');
const validators = require('../validators');
const auditLog = require('../middlewares/auditLog');

router.get('/', authJWT, verifyRole('dueno', 'gerente'), zonaController.listar);
router.post('/', authJWT, verifyRole('dueno'), validators.zonaCrear, auditLog('zonas'), zonaController.crear);
router.put('/:id', authJWT, verifyRole('dueno'), validators.zonaActualizar, auditLog('zonas'), zonaController.actualizar);
router.delete('/:id', authJWT, verifyRole('dueno'), validators.zonaEliminar, auditLog('zonas'), zonaController.eliminar);

module.exports = router;

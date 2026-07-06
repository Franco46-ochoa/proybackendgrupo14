const express = require('express');
const router = express.Router();
const codigoController = require('../controllers/codigoController');
const authJWT = require('../middlewares/authJWT');
const verifyRole = require('../middlewares/verifyRole');
const auditLog = require('../middlewares/auditLog');
const { generarCodigoValidator } = require('../middlewares/validators');

router.get('/', authJWT, verifyRole('dueno', 'administrador'), codigoController.listar);
router.post('/generar', authJWT, verifyRole('dueno', 'administrador'), generarCodigoValidator, auditLog(), codigoController.generar);
router.put('/:id', authJWT, verifyRole('dueno', 'administrador'), auditLog(), codigoController.revocar);

module.exports = router;

const express = require('express');
const router = express.Router();
const zonaController = require('../controllers/zonaController');
const authJWT = require('../middlewares/authJWT');
const verifyRole = require('../middlewares/verifyRole');
const auditLog = require('../middlewares/auditLog');

router.get('/', authJWT, verifyRole('dueno', 'gerente'), zonaController.listar);
router.post('/', authJWT, verifyRole('dueno'), auditLog(), zonaController.crear);
router.put('/:id', authJWT, verifyRole('dueno'), auditLog(), zonaController.actualizar);
router.delete('/:id', authJWT, verifyRole('dueno'), auditLog(), zonaController.eliminar);

module.exports = router;

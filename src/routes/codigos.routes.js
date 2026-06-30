const express = require('express');
const router = express.Router();
const codigoController = require('../controllers/codigoController');
const authJWT = require('../middlewares/authJWT');
const verifyRole = require('../middlewares/verifyRole');

router.get('/', authJWT, verifyRole('dueno'), codigoController.listar);
router.post('/generar', authJWT, verifyRole('dueno'), codigoController.generar);
router.put('/:id', authJWT, verifyRole('dueno'), codigoController.revocar);

module.exports = router;

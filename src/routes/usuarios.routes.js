const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const authJWT = require('../middlewares/authJWT');
const verifyRole = require('../middlewares/verifyRole');

router.get('/', authJWT, verifyRole('dueno'), usuarioController.listar);
router.post('/', authJWT, verifyRole('dueno'), usuarioController.crear);
router.put('/:id', authJWT, verifyRole('dueno'), usuarioController.actualizar);
router.delete('/:id', authJWT, verifyRole('dueno'), usuarioController.desactivar);

module.exports = router;

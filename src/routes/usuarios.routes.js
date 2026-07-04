const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const authJWT = require('../middlewares/authJWT');
const verifyRole = require('../middlewares/verifyRole');
const validators = require('../validators');

router.get('/', authJWT, verifyRole('dueno'), usuarioController.listar);
router.post('/', authJWT, verifyRole('dueno'), validators.usuarioCrear, usuarioController.crear);
router.put('/:id', authJWT, verifyRole('dueno'), validators.usuarioActualizar, usuarioController.actualizar);
router.delete('/:id', authJWT, verifyRole('dueno'), validators.usuarioDesactivar, usuarioController.desactivar);

module.exports = router;

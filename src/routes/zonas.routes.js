const express = require('express');
const router = express.Router();
const zonaController = require('../controllers/zonaController');
const authJWT = require('../middlewares/authJWT');
const verifyRole = require('../middlewares/verifyRole');
const validators = require('../validators');

router.get('/', authJWT, verifyRole('dueno', 'gerente'), zonaController.listar);
router.post('/', authJWT, verifyRole('dueno'), validators.zonaCrear, zonaController.crear);
router.put('/:id', authJWT, verifyRole('dueno'), validators.zonaActualizar, zonaController.actualizar);
router.delete('/:id', authJWT, verifyRole('dueno'), validators.zonaEliminar, zonaController.eliminar);

module.exports = router;

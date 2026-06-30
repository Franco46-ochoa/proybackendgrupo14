const express = require('express');
const router = express.Router();
const proveedorController = require('../controllers/proveedorController');
const authJWT = require('../middlewares/authJWT');
const verifyRole = require('../middlewares/verifyRole');

router.get('/', authJWT, verifyRole('dueno', 'gerente'), proveedorController.listar);
router.post('/', authJWT, verifyRole('dueno', 'gerente'), proveedorController.crear);
router.put('/:id', authJWT, verifyRole('dueno', 'gerente'), proveedorController.actualizar);
router.delete('/:id', authJWT, verifyRole('dueno'), proveedorController.eliminar);

module.exports = router;

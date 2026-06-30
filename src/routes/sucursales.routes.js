const express = require('express');
const router = express.Router();
const sucursalController = require('../controllers/sucursalController');
const authJWT = require('../middlewares/authJWT');
const verifyRole = require('../middlewares/verifyRole');

router.get('/', authJWT, verifyRole('dueno', 'gerente', 'empleado'), sucursalController.listar);
router.post('/', authJWT, verifyRole('dueno'), sucursalController.crear);
router.put('/:id', authJWT, verifyRole('dueno'), sucursalController.actualizar);
router.delete('/:id', authJWT, verifyRole('dueno'), sucursalController.eliminar);

module.exports = router;

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authJWT = require('../middlewares/authJWT');
const verifyRole = require('../middlewares/verifyRole');

router.post('/seed', authJWT, verifyRole('administrador'), adminController.cargarDatosHistoricos);

module.exports = router;

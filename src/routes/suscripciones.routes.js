const express = require('express');
const router = express.Router();
const suscripcionController = require('../controllers/suscripcionController');
const authJWT = require('../middlewares/authJWT');
const validators = require('../validators');

router.post('/', authJWT, validators.suscripcionCrear, suscripcionController.crear);
router.get('/', authJWT, suscripcionController.obtener);

module.exports = router;

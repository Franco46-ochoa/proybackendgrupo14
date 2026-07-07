const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authJWT = require('../middlewares/authJWT');
const validators = require('../validators');

router.post('/register', validators.authRegister, authController.register);
router.post('/login', validators.authLogin, authController.login);
router.post('/google', authController.googleLogin);
router.get('/profile', authJWT, authController.profile);

module.exports = router;

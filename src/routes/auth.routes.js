const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authJWT = require('../middlewares/authJWT');
const { registerValidator, loginValidator } = require('../middlewares/validators');

router.post('/register', registerValidator, authController.register);
router.post('/login', loginValidator, authController.login);
router.post('/google', authController.googleLogin);
router.get('/profile', authJWT, authController.profile);

module.exports = router;

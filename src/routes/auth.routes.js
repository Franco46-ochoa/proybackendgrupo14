const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authJWT = require('../middlewares/authJWT');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', authJWT, authController.profile);

module.exports = router;

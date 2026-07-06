const express = require("express");
const router = express.Router();
const auditoriaController = require("../controllers/auditoriaController");
const authJWT = require("../middlewares/authJWT");
const verifyRole = require("../middlewares/verifyRole");

router.get("/", authJWT, verifyRole("dueno"), auditoriaController.listar);

module.exports = router;

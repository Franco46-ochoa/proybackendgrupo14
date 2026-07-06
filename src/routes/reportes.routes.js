const express = require("express");
const router = express.Router();
const reporteController = require("../controllers/reporteController");
const authJWT = require("../middlewares/authJWT");
const verifyRole = require("../middlewares/verifyRole");
const auditLog = require("../middlewares/auditLog");
router.get("/", authJWT, reporteController.listar);
router.post(
  "/generar",
  authJWT,
  verifyRole("dueno", "gerente"),
  auditLog(),
  reporteController.generar,
);
module.exports = router;

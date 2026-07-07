const express = require("express");
const mpCtrl = require("../controllers/mp.controller");
const authJWT = require("../middlewares/authJWT");

const router = express.Router();

router.post("/subscription", authJWT, mpCtrl.getSubscriptionLink);
router.post("/payment", authJWT, mpCtrl.getPaymentLink);

module.exports = router;

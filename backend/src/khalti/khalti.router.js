const express = require("express");

const {
  initializeKhalti,
  completePayment,
} = require("./initialize.khalti.controller");

const router = express.Router();

router.post("/initialize-khalti", initializeKhalti);
router.get("/complete-khalti-payment", completePayment);

module.exports = router;

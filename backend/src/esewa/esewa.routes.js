const express = require("express");
const {
  EsewaInitiatePayment,
  paymentStatus,
} = require("./esewa.controller.js"); // note the .js extension

const router = express.Router();

router.post("/initiate-payment", EsewaInitiatePayment);
router.post("/payment-status", paymentStatus);

module.exports = router;

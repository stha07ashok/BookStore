const express = require("express");
const {
  createAOrder,
  getOrderByEmail,
  getAllOrders,
  deleteOrderById,
  updateOrderStatus,
} = require("./order.controller");

const router = express.Router();

// create order endpoint
router.post("/", createAOrder);

// get orders by user email
router.get("/email/:email", getOrderByEmail);

router.get("/allorders", getAllOrders);

router.delete("/:id", deleteOrderById);

router.put("/update/:id", updateOrderStatus);

module.exports = router;

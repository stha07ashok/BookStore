const express = require("express");
const {
  createAOrder,
  getOrderByEmail,
  deleteOrderById,
  updateOrderStatus,
  getAllOrdersByEmail,
  getAllOrders,
} = require("./order.controller");

const router = express.Router();

// create order endpoint
router.post("/", createAOrder);

// get orders by user email
router.get("/email/:email", getOrderByEmail);

router.get("/allordersbyemail/:email", getAllOrdersByEmail);

router.delete("/:id", deleteOrderById);

router.put("/update/:id", updateOrderStatus);

router.get("/allorders", getAllOrders);

module.exports = router;

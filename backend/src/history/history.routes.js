const express = require("express");
const {
  getHistory,
  deleteHistory,
  clearAllHistory,
  createOrderHistory,
  createOldBookHistory,
} = require("./history.controller");

const router = express.Router();

// Route to place an order and save history
router.post("/order", createOrderHistory);

// Route to sell an old book and save history
router.post("/old-book", createOldBookHistory);

// Route to get all history records
router.get("/allhistory", getHistory);

// Route to delete a specific history record by its ID
router.delete("/deletehistory/:historyId", deleteHistory); // Changed to "/history/:historyId" to match parameter

// Route to clear all history records
router.delete("/clearhistory", clearAllHistory); // Changed to "/history" for clarity

module.exports = router;

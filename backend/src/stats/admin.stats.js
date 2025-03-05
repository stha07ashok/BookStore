const mongoose = require("mongoose");
const express = require("express");
const Order = require("../orders/order.model");
const Book = require("../books/book.model");
const soldOldBooks = require("../soldOldBooks/old.book.model");
const router = express.Router();

// GET /api/admin - Retrieve admin statistics
router.get("/", async (req, res) => {
  try {
    // 1. Total number of orders
    const totalOrders = await Order.countDocuments();

    // 2. Total sales (sum of all totalPrice from orders)
    const totalSalesResult = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$totalPrice" },
        },
      },
    ]);
    const totalSales = totalSalesResult[0]?.totalSales || 0;

    // 3. Trending books count
    const trendingBooksCount = await Book.aggregate([
      { $match: { trending: true } },
      { $count: "trendingBooksCount" },
    ]);
    const trendingBooks =
      trendingBooksCount.length > 0
        ? trendingBooksCount[0].trendingBooksCount
        : 0;

    // 4. Total number of books
    const totalBooks = await Book.countDocuments();

    // 5. Monthly sales (group by month and sum total sales for each month)
    const monthlySales = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          totalSales: { $sum: "$totalPrice" },
          totalOrders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // 6. Total sold books: count documents in soldOldBooks collection with status "Sold"
    const totalSoldBooks = await soldOldBooks.countDocuments({
      status: "Sold",
    });

    // Return the aggregated admin stats
    res.status(200).json({
      totalOrders,
      totalSales,
      trendingBooks,
      totalBooks,
      monthlySales,
      totalSoldBooks,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({ message: "Failed to fetch admin stats" });
  }
});

module.exports = router;

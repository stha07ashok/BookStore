const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");

const mongoose = require("mongoose");
const port = process.env.PORT || 5000;
require("dotenv").config();

// middleware
app.use(express.json({ limit: "50mb", limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://book-store-frontend-lyart.vercel.app/",
      "https://book-store-frontend-git-main-ashok-shresthas-projects-d61f8c93.vercel.app/",
      "https://book-store-frontend-nnh1m27zw-ashok-shresthas-projects-d61f8c93.vercel.app/",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.options("*", cors());

// routes
const bookRoutes = require("./src/books/book.route.js");
const orderRoutes = require("./src/orders/order.route.js");
const userRoutes = require("./src/users/user.route");
const adminRoutes = require("./src/stats/admin.stats");
const soldOldBooksRoutes = require("./src/soldOldBooks/old.book.routes.js");
const esewaRoutes = require("./src/esewa/esewa.routes.js");

app.use("/api/books", bookRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/sellbook", soldOldBooksRoutes);
app.use("/api/esewa", esewaRoutes);

async function main() {
  await mongoose.connect(process.env.DB_URL);

  app.get("/", (req, res) => {
    res.send("Book Server!");
  });
}

main()
  .then(() => console.log("mongodb connected successfully"))
  .catch((err) => console.log(err));

app.listen(port, () => {
  console.log(`Book Server listening on port ${port}`);
});

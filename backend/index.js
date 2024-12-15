const express = require("express");
const app = express();
const cors = require("cors");

const mongoose = require("mongoose");
const port = process.env.PORT || 5000;
require("dotenv").config();

// middleware
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

// routes
const bookRoutes = require("./src/books/book.route.js");
const orderRoutes = require("./src/orders/order.route.js");
const userRoutes = require("./src/users/user.route");
const adminRoutes = require("./src/stats/admin.stats");

app.use("/api/books", bookRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/admin", adminRoutes);

async function main() {
  await mongoose.connect(process.env.DB_URL);
  // mongodb-password:JBjcwHO7ZoyHmKEQ
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

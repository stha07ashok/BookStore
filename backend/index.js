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

app.use("/api/books", bookRoutes);

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

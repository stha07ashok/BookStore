const express = require("express");
const router = express.Router();
const {
  sellBook,
  getAllSoldBooks,
  deleteABook,
  updateBookStatus,
  getAllSoldBooksHistory,
} = require("./old.book.controller.js");
const upload = require("../middleware/upload.multer.js");

// Route for selling a book with file upload
router.post("/sell-old-book", upload.single("image"), sellBook);
router.get("/sold-books", getAllSoldBooks);
router.delete("/delete/:id", deleteABook);
router.put("/update/:id", updateBookStatus);
router.get("/sold-books-history", getAllSoldBooksHistory);

module.exports = router;

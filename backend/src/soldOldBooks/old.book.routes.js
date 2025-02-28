const express = require("express");
const router = express.Router();
const {
  sellBook,

  deleteABook,
  updateBookStatus,
  getAllSoldBooks,
  getSoldBooksByEmail,
  getAllSoldBooksByEmail,
} = require("./old.book.controller.js");
const upload = require("../middleware/upload.multer.js");

// Route for selling a book with file upload
router.post("/sell-old-book", upload.single("image"), sellBook);

router.delete("/delete/:id", deleteABook);
router.put("/update/:id", updateBookStatus);
router.get("/sold-books-history/:email", getAllSoldBooks);
router.get("/soldbooksbyemail/:email", getSoldBooksByEmail);
router.get("/allsoldbooksbyemail/:email", getAllSoldBooksByEmail);

module.exports = router;

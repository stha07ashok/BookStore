const express = require("express");
const router = express.Router();
const { sellBook } = require("./old.book.controller.js");
const upload = require("../middleware/upload.multer.js");

// Route for selling a book with file upload
router.post("/sell-old-book", upload.single("image"), sellBook);

module.exports = router;

const mongoose = require("mongoose");

const oldBookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  author: {
    type: String,
    required: [true, "Author is required"],
  },
  edition: {
    type: String,
    required: [true, "Edition is required"],
  },
  type: {
    type: String,
    required: [true, "Type is required"],
  },
  image: {
    type: String, // URL from Cloudinary
    required: [true, "Image is required"],
  },
});

module.exports = mongoose.model("oldSoldBook", oldBookSchema);

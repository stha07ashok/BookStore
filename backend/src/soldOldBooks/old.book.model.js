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
    type: String,
    required: [true, "Image is required"],
  },
  status: {
    type: String,
    required: true,
    enum: ["Pending", "Sold", "Rejected"],
    default: "Pending",
  },
  email: {
    type: String,
    required: [true, "Email address is required"],
    match: [/\S+@\S+\.\S+/, "Please enter a valid email address"],
  },
  contactNumber: {
    type: String,
    required: [true, "Contact number is required"],
    match: [/^[0-9]{10}$/, "Please enter a valid 10-digit contact number"],
  },
  address: {
    type: String,
    required: [true, "Address is required"],
  },
});

module.exports = mongoose.model("oldSoldBook", oldBookSchema);

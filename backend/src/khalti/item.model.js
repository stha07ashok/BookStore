const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    trending: { type: Boolean, default: false },
    coverImage: { type: String, required: true },
    oldPrice: { type: Number, required: true },
    newPrice: { type: Number, required: true },
    bookType: { type: String, required: true },
    itemsNumber: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

const Item = mongoose.model("Item", itemSchema);
module.exports = Item;

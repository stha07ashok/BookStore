const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  itemType: {
    type: String,
    enum: ["Order", "OldBook"],
    required: true,
  },
  actionDetails: {
    type: Object,
    required: true,
  },
  actionDate: {
    type: Date,
    default: Date.now,
  },
});

const History = mongoose.model("History", historySchema);

module.exports = History;

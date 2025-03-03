const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    product_id: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      required: true,
      enum: ["PENDING", "COMPLETE", "FAILED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

transactionSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;

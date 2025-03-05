const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    address: {
      city: {
        type: String,
        required: true,
      },
      country: String,
      state: String,
      zipcode: String,
    },
    phone: {
      type: Number,
      required: true,
    },
    productIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
        required: true,
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["Pending", "Delivered", "On the way", "Order is deleted!!"],
      default: "Pending",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["Cash on Delivery", "Esewa"],
    },
    bookTitle: {
      type: [String],
      required: true,
    },
    quantity: {
      type: [Number],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;

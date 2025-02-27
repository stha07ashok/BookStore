const mongoose = require("mongoose");
const { initializeKhaltiPayment, verifyKhaltiPayment } = require("./khalti");
const PurchasedItem = require("./purchased.item.model");
const Payment = require("./payment.model");
const Item = require("./item.model");

require("dotenv").config();

const initializeKhalti = async (req, res) => {
  try {
    const { id, totalPrice, website_url } = req.body;

    const parsedPrice = Number(totalPrice);
    console.log("Parsed Price:", parsedPrice);

    // Validate price value
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid price value",
      });
    }

    console.log("Searching for item with ID:", id);
    console.log("Searching for item with Price:", parsedPrice);

    // Query the database for the item with the correct ID and price
    const itemData = await Item.findOne({
      _id: new mongoose.Types.ObjectId(id),
      newPrice: parsedPrice,
    });

    if (!itemData) {
      console.log("Item not found with ID:", id);
      return res.status(400).json({
        success: false,
        message: "Item not found",
      });
    }

    console.log("Item found:", itemData);

    // Create the purchased item entry in the database
    const purchasedItemData = await PurchasedItem.create({
      item: id,
      paymentMethod: "khalti",
      totalPrice: parsedPrice,
    });

    const purchaseOrderId = purchasedItemData._id.toString(); // Convert ObjectId to string

    // Log the payment initialization request details
    const amountInCents = parsedPrice * 100;
    console.log("Khalti Payment Request:", {
      amount: amountInCents,
      purchase_order_id: purchaseOrderId,
      purchase_order_name: itemData.title,
      return_url: `${process.env.KHALTI_GATEWAY_URL}/complete-khalti-payment`,
      website_url: website_url,
    });

    // Call the Khalti payment initialization function
    const paymentInitiate = await initializeKhaltiPayment({
      amount: amountInCents, // Convert to cents for Khalti payment
      purchase_order_id: purchaseOrderId,
      purchase_order_name: itemData.title,
      return_url: `${process.env.KHALTI_GATEWAY_URL}/complete-khalti-payment`,
      website_url: website_url,
    });

    res.json({
      success: true,
      purchasedItemData,
      payment: paymentInitiate,
    });
  } catch (error) {
    // Log any errors for debugging purposes
    console.error("Error initializing Khalti payment:", error);

    res.status(500).json({
      success: false,
      message: "An error occurred",
      error: error.message,
    });
  }
};

// it is our `return url` where we verify the payment done by user
const completePayment = async (req, res) => {
  const {
    pidx,
    txnId,
    amount,
    mobile,
    purchase_order_id,
    purchase_order_name,
    transaction_id,
  } = req.query;

  try {
    // Log the query parameters to verify the data being sent
    console.log("Complete Payment Query Params:", req.query);

    const paymentInfo = await verifyKhaltiPayment(pidx);

    // Log the payment verification response to help with debugging
    console.log("Payment Info from Khalti:", paymentInfo);

    // Check if payment is completed and details match
    if (
      paymentInfo?.status !== "Completed" ||
      paymentInfo.transaction_id !== transaction_id ||
      Number(paymentInfo.total_amount) !== Number(amount)
    ) {
      return res.status(400).json({
        success: false,
        message: "Incomplete information",
        paymentInfo,
      });
    }

    // Check if payment done in valid item
    const purchasedItemData = await PurchasedItem.findOne({
      _id: purchase_order_id,
      totalPrice: amount,
    });

    if (!purchasedItemData) {
      return res.status(400).send({
        success: false,
        message: "Purchased data not found",
      });
    }

    // Updating purchase record to "completed"
    await PurchasedItem.findByIdAndUpdate(purchase_order_id, {
      $set: {
        status: "completed",
      },
    });

    // Create a new payment record in the Payment collection
    const paymentData = await Payment.create({
      pidx,
      transactionId: transaction_id,
      productId: purchase_order_id,
      amount,
      dataFromVerificationReq: paymentInfo,
      apiQueryFromUser: req.query,
      paymentGateway: "khalti",
      status: "success",
    });

    // Send success response
    res.json({
      success: true,
      message: "Payment Successful",
      paymentData,
    });
  } catch (error) {
    console.error("Error in completePayment:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred",
      error: error.message,
    });
  }
};

module.exports = { initializeKhalti, completePayment };

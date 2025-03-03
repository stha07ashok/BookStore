const Transaction = require("./transaction.model");

const { EsewaPaymentGateway, EsewaCheckStatus } = require("esewajs");

const EsewaInitiatePayment = async (req, res) => {
  const { amount, productId } = req.body;
  console.log("Received payment initiation request:", req.body);

  try {
    const reqPayment = await EsewaPaymentGateway(
      amount,
      0,
      0,
      0,
      productId,
      process.env.MERCHANT_ID,
      process.env.SECRET,
      process.env.SUCCESS_URL,
      process.env.FAILURE_URL,
      process.env.ESEWAPAYMENT_URL,
      undefined,
      undefined
    );

    console.log("eSewa payment gateway response:", reqPayment);

    if (!reqPayment) {
      return res.status(400).json("Error sending data to eSewa.");
    }

    if (reqPayment.status === 200) {
      const transaction = new Transaction({
        product_id: productId,
        amount: amount,
      });
      await transaction.save();
      console.log("Transaction saved successfully.");
      return res.send({
        url: reqPayment.request.res.responseUrl,
      });
    } else {
      return res.status(400).json("Failed to initiate payment with eSewa.");
    }
  } catch (error) {
    console.error("Error initiating payment:", error);
    return res.status(500).json("Server error.");
  }
};

const paymentStatus = async (req, res) => {
  const { product_id } = req.body; // Extract data from request body
  try {
    // Find the transaction by its signature
    const transaction = await Transaction.findOne({ product_id });
    if (!transaction) {
      return res.status(400).json({ message: "Transaction not found" });
    }

    const paymentStatusCheck = await EsewaCheckStatus(
      transaction.amount,
      transaction.product_id,
      process.env.MERCHANT_ID,
      process.env.ESEWAPAYMENT_STATUS_CHECK_URL ||
        " https://uat.esewa.com.np/api/epay/transaction/status/ "
    );

    if (paymentStatusCheck.status === 200) {
      // Update the transaction status
      transaction.status = paymentStatusCheck.data.status;
      await transaction.save();
      res
        .status(200)
        .json({ message: "Transaction status updated successfully" });
    }
  } catch (error) {
    console.error("Error updating transaction status:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { EsewaInitiatePayment, paymentStatus };

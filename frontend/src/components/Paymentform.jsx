import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { generateUniqueId } from "esewajs";
import { useInitiatePaymentMutation } from "../redux/features/esewa/esewa.api";

const PaymentForm = () => {
  const location = useLocation();
  const [amount, setAmount] = useState(location.state?.amount || "");
  const [initiatePayment, { isLoading, error }] = useInitiatePaymentMutation();

  const handlePayment = async (e) => {
    e.preventDefault();
    try {
      const paymentData = {
        amount,
        productId: generateUniqueId(),
      };
      const response = await initiatePayment(paymentData).unwrap();
      window.location.href = response.url;
    } catch (err) {
      console.error("Error initiating payment:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center  p-6">
      <div className="max-w-md w-full  rounded-lg shadow-md p-6 border-2 border-gray-300 ">
        <h1 className="text-2xl font-bold mb-4 text-center dark:text-white">
          eSewa Payment
        </h1>
        <form onSubmit={handlePayment}>
          <div className="mb-4">
            <label className="block font-semibold mb-1" htmlFor="amount">
              Amount:
            </label>
            <input
              type="number"
              id="amount"
              defaultValue={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="w-full px-3 py-2 border dark:bg-black rounded-md"
              placeholder="Enter amount"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-700"
          >
            {isLoading ? "Processing..." : "Pay with eSewa"}
          </button>
          {error && <p className="text-red-500 mt-2">Error: {error.message}</p>}
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;

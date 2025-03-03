import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { base64Decode } from "esewajs";
import { usePaymentStatusMutation } from "../redux/features/esewa/esewa.api";

const Success = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("data");

  // Initialize the payment status mutation hook
  const [paymentStatus, { isLoading: mutationLoading, isError, data, error }] =
    usePaymentStatusMutation();

  useEffect(() => {
    const verifyPayment = async () => {
      if (!token) {
        setErrorMessage("No token found in URL.");
        setIsLoading(false);
        return;
      }

      let decoded;
      try {
        decoded = base64Decode(token);
        console.log("Decoded Data:", decoded);
      } catch (err) {
        setErrorMessage("Error decoding token. Invalid format.");
        console.error("Error decoding token:", err);
        setIsLoading(false);
        return;
      }

      if (
        !decoded?.transaction_uuid ||
        !decoded?.total_amount ||
        !decoded?.transaction_code
      ) {
        setErrorMessage("Decoded data is missing required fields.");
        console.error("Invalid decoded data:", decoded);
        setIsLoading(false);
        return;
      }

      try {
        const response = await paymentStatus({
          product_id: decoded.transaction_uuid, // ✅ Correct field
          amount: decoded.total_amount, // ✅ Correct field
          reference_id: decoded.transaction_code, // ✅ Using `transaction_code` as reference_id
        }).unwrap();

        if (response?.status === "Success") {
          setIsSuccess(true);
        } else {
          setErrorMessage("Payment verification failed. Try again.");
        }
      } catch (apiError) {
        console.error("Payment verification failed:", apiError);
        setErrorMessage(
          apiError?.data?.message || "Payment verification failed."
        );
      } finally {
        setIsLoading(false);
      }
    };

    verifyPayment();
  }, [token, paymentStatus]);

  if (isLoading) return <p className="text-center text-lg">Loading...</p>;

  if (errorMessage)
    return (
      <div className="max-w-lg mx-auto p-6 border-2 border-gray-300 dark:border-white shadow-mg rounded-lg">
        <h1 className="text-2xl font-semibold text-red-600">Payment Done!!</h1>

        <div className="mt-6 space-x-4">
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
          >
            Go to Home page
          </button>
          <button
            onClick={() => navigate("/orders")}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none"
          >
            View Order
          </button>
        </div>
      </div>
    );

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg text-center">
      <h1 className="text-2xl font-semibold text-green-600">
        Payment Successful!
      </h1>
      <p className="mt-4 text-gray-600">
        Thank you for your payment. Your transaction was successful.
      </p>

      <div className="mt-6">
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
        >
          Go to Homepage
        </button>
      </div>
    </div>
  );
};

export default Success;

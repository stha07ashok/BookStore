import React, { useEffect, useState } from "react";
import { useGetAllOrdersQuery } from "../../../redux/features/orders/ordersApi";
import { useNavigate } from "react-router-dom";

const GetAllOrders = () => {
  const { data: orders = [], error, isLoading } = useGetAllOrdersQuery();
  const navigate = useNavigate();
  const [newOrders, setNewOrders] = useState({});

  useEffect(() => {
    // Get the previously stored order counts from localStorage
    const prevOrderCounts =
      JSON.parse(localStorage.getItem("orderCounts")) || {};

    // Get the previously stored "newOrders" state from localStorage
    const prevNewOrders = JSON.parse(localStorage.getItem("newOrders")) || {};

    // Calculate current order counts
    const currentOrderCounts = orders.reduce((acc, order) => {
      acc[order.email] = (acc[order.email] || 0) + 1;
      return acc;
    }, {});

    // Detect new orders
    const detectedNewOrders = {};
    for (const email in currentOrderCounts) {
      // Check if the current order count is greater than the previous order count
      if (currentOrderCounts[email] > (prevOrderCounts[email] || 0)) {
        detectedNewOrders[email] = true; // Mark as new
      } else {
        // Keep the existing "new" state if it was marked as new previously
        detectedNewOrders[email] = prevNewOrders[email] || false;
      }
    }

    // Update the newOrders state with detected new orders
    setNewOrders(detectedNewOrders);

    // Save the current order counts to localStorage
    localStorage.setItem("orderCounts", JSON.stringify(currentOrderCounts));

    // Only update newOrders in localStorage if there are any changes
    if (Object.keys(detectedNewOrders).length > 0) {
      localStorage.setItem("newOrders", JSON.stringify(detectedNewOrders));
    }
  }, [orders]); // Re-run effect when `orders` change

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading orders</div>;

  // Calculate the number of orders for each email
  const emailOrderCounts = orders.reduce((acc, order) => {
    acc[order.email] = (acc[order.email] || 0) + 1;
    return acc;
  }, {});

  const uniqueEmails = Object.keys(emailOrderCounts);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Orders by Email
      </h2>

      {uniqueEmails.length === 0 ? (
        <div className="text-center text-gray-500">No orders found!</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {uniqueEmails.map((email) => (
            <div
              key={email}
              className="cursor-pointer bg-white shadow-md p-6 rounded-lg border border-gray-300 hover:bg-gray-100 transition relative flex justify-between items-center"
              onClick={() => {
                navigate(
                  `/dashboard/orderbyemail/${encodeURIComponent(email)}`
                );

                // Once clicked, mark the email as "seen" (remove "New!")
                setNewOrders((prev) => ({ ...prev, [email]: false }));

                // Update localStorage to mark this email as seen
                const updatedNewOrders = { ...newOrders, [email]: false };
                localStorage.setItem(
                  "newOrders",
                  JSON.stringify(updatedNewOrders)
                );
              }}
            >
              <h3 className="text-lg font-semibold text-black">{email}</h3>

              <div className="flex gap-2 items-center">
                <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {emailOrderCounts[email]}
                </span>

                {/* Show "New!" label only if it's marked as new */}
                {newOrders[email] && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    New!
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GetAllOrders;

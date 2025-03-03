import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
} from "../../../redux/features/orders/ordersApi";

const OrdersByEmail = () => {
  const { email } = useParams();
  const navigate = useNavigate();
  const { data: orders = [], error, isLoading } = useGetAllOrdersQuery();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [newOrders, setNewOrders] = useState({});

  useEffect(() => {
    // Get previously seen orders from localStorage
    const seenOrders =
      JSON.parse(localStorage.getItem(`seenOrders_${email}`)) || [];

    // Extract order IDs from fetched data
    const currentOrderIds = orders.map((order) => order._id);

    // Detect truly new orders (those not in seenOrders)
    const detectedNewOrders = {};
    currentOrderIds.forEach((id) => {
      if (!seenOrders.includes(id)) {
        detectedNewOrders[id] = true;
      }
    });

    setNewOrders(detectedNewOrders);
  }, [orders, email]);

  useEffect(() => {
    // Store the current order IDs as seen once the user visits the page
    if (orders.length > 0) {
      const orderIds = orders.map((order) => order._id);
      localStorage.setItem(`seenOrders_${email}`, JSON.stringify(orderIds));
    }
  }, [orders, email]);

  const handleStatusChange = async (orderId, status) => {
    try {
      await updateOrderStatus({ orderId, status }).unwrap();
      console.log(`Order ${orderId} status updated to ${status}`);
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const getStatusTextColor = (status) => {
    switch (status) {
      case "Delivered":
        return "text-green-500";
      case "Rejected":
        return "text-red-500";
      case "Pending":
        return "text-yellow-500";
      case "On the way":
        return "text-violet-500";
      default:
        return "text-gray-600";
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>No orders found!!!</div>;

  const filteredOrders = orders
    .filter((order) => order.email === email)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="container mx-auto p-6">
      <button
        className="text-blue-500 mb-4 border-2 border-gray-300 mx-3 my-3 px-3 py-3 rounded-md shadow-md"
        onClick={() => navigate(-1)}
      >
        Back
      </button>

      <h2 className="text-2xl font-semibold mb-6 text-center">
        Orders for {email}
      </h2>

      {filteredOrders.length === 0 ? (
        <div className="text-center text-gray-500">No orders found!</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {filteredOrders.map((order, index) => (
            <div
              key={order._id}
              className="relative bg-white shadow-md rounded-lg p-6 border-2 border-black dark:border-white group dark:bg-gray-800 transition-transform transform hover:scale-105"
            >
              {/* New Order Badge (Only if order is actually new) */}
              {newOrders[order._id] && (
                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  New!
                </span>
              )}

              <p className="p-1 bg-secondary text-white w-10 rounded mb-2">
                #{index + 1}
              </p>
              <h3 className="font-bold text-lg text-black dark:text-white mb-2">
                Order ID: {order._id}
              </h3>
              <p className="text-sm text-gray-600 dark:text-white">
                <span className="font-semibold">Name:</span> {order.name}
              </p>
              <p className="text-sm text-gray-600 dark:text-white">
                <span className="font-semibold">Phone:</span> {order.phone}
              </p>
              <p className="text-sm text-gray-600 dark:text-white">
                <span className="font-semibold">Total Price:</span> Rs.
                {order.totalPrice}
              </p>
              <p className="text-sm text-gray-600 dark:text-white ">
                <span className="font-semibold">Payment Method:</span>{" "}
                {order.paymentMethod}
                {order.paymentMethod === "Esewa" && (
                  <span className="text-green-500 font-bold ml-2">
                    (Payment is completed!!)
                  </span>
                )}
              </p>

              <div className="mt-4">
                <h4 className="font-semibold text-md text-black dark:text-white">
                  Address:
                </h4>
                <p className="text-sm text-gray-600 dark:text-white">
                  {order.address.city}, {order.address.state},{" "}
                  {order.address.country}, {order.address.zipcode}
                </p>
              </div>

              {/* Status Display with Dynamic Text Color */}
              <div className="mt-4 flex gap-1 items-center">
                <h4 className="font-semibold text-md text-black dark:text-white">
                  Status:
                </h4>
                <span
                  className={`text-sm font-semibold ${getStatusTextColor(
                    order.status
                  )}`}
                >
                  {order.status || "Pending"}
                </span>
              </div>

              <div className="mt-4 gap-4 grid md:grid-cols-2 sm:grid-cols-1 lg:grid-cols-2 justify-center">
                <button
                  className="bg-green-500 text-white font-bold py-1 px-3 rounded hover:bg-green-700 transition duration-300"
                  onClick={() => handleStatusChange(order._id, "Delivered")}
                >
                  Mark as Delivered
                </button>
                <button
                  className="bg-red-500 text-white font-bold py-1 px-3 rounded hover:bg-red-700 transition duration-300"
                  onClick={() => handleStatusChange(order._id, "Rejected")}
                >
                  Reject Order
                </button>
                <button
                  className="bg-yellow-500 text-white font-bold py-1 px-3 rounded hover:bg-yellow-700 transition duration-300"
                  onClick={() => handleStatusChange(order._id, "Pending")}
                >
                  Set as Pending
                </button>
                <button
                  className="bg-violet-500 text-white font-bold py-1 px-3 rounded hover:bg-purple-700 transition duration-300"
                  onClick={() => handleStatusChange(order._id, "On the way")}
                >
                  On the way
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersByEmail;

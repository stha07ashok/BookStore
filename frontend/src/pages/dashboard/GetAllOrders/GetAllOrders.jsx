import React, { useEffect } from "react";
import {
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
  useDeleteOrderMutation,
} from "../../../redux/features/orders/ordersApi";

const GetAllOrders = () => {
  const { data: orders = [], error, isLoading } = useGetAllOrdersQuery();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [deleteOrder] = useDeleteOrderMutation();

  useEffect(() => {
    console.log("Orders:", orders);
  }, [orders]);

  const handleStatusChange = async (orderId, status) => {
    try {
      await updateOrderStatus({ orderId, status }).unwrap();
      console.log(`Order ${orderId} status updated to ${status}`);
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handleDelete = async (orderId) => {
    try {
      await deleteOrder(orderId);
      console.log(`Order ${orderId} deleted successfully`);
    } catch (error) {
      console.error("Error deleting order:", error);
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
  if (error) return <div>Error loading orders</div>;

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6 text-center">Orders</h2>

      {orders.length === 0 ? (
        <div className="text-center text-gray-500">No orders found!</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order, index) => (
            <div
              key={order._id}
              className="bg-white shadow-md rounded-lg p-6 border-2 border-black dark:border-white group dark:bg-gray-800 transition-transform transform hover:scale-105"
            >
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
                <span className="font-semibold">Email:</span> {order.email}
              </p>
              <p className="text-sm text-gray-600 dark:text-white">
                <span className="font-semibold">Phone:</span> {order.phone}
              </p>
              <p className="text-sm text-gray-600 dark:text-white">
                <span className="font-semibold">Total Price:</span> $
                {order.totalPrice}
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

              <div className="mt-4">
                <h4 className="font-semibold text-md text-black dark:text-white">
                  Product Id:
                </h4>
                <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-white">
                  {order.productIds.map((productId) => (
                    <li key={productId}>{productId}</li>
                  ))}
                </ul>
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

              {/* Delete Button - Only if status is "Delivered" or "Rejected" */}
              <div className="mt-4">
                <button
                  onClick={() => handleDelete(order._id)}
                  className={`w-full text-white font-bold py-2 px-4 rounded transition duration-300 ${
                    order.status === "Delivered" || order.status === "Rejected"
                      ? "bg-red-500 hover:bg-red-700"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                  disabled={
                    order.status !== "Delivered" && order.status !== "Rejected"
                  }
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GetAllOrders;

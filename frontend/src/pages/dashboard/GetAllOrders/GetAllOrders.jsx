import React, { useEffect } from "react";
import {
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
} from "../../../redux/features/orders/ordersApi";

const GetAllOrders = () => {
  const { data: orders = [], error, isLoading } = useGetAllOrdersQuery();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();

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

              <div className="mt-4 flex gap-1 items-center">
                <h4 className="font-semibold text-md text-black dark:text-white">
                  Status:
                </h4>
                <span className="text-sm text-gray-600 dark:text-white font-semibold">
                  {order.status || "pending"}
                </span>
              </div>

              <div className="mt-4 flex gap-4 flex-wrap justify-center">
                <button
                  className="bg-green-500 text-white font-bold py-1 px-3 rounded hover:bg-green-700 transition duration-300"
                  onClick={() => handleStatusChange(order._id, "delivered")}
                >
                  Mark as Delivered
                </button>
                <button
                  className="bg-red-500 text-white font-bold py-1 px-3 rounded hover:bg-red-700 transition duration-300"
                  onClick={() => handleStatusChange(order._id, "rejected")}
                >
                  Reject Order
                </button>
                <button
                  className="bg-yellow-500 text-white font-bold py-1 px-3 rounded hover:bg-yellow-700 transition duration-300"
                  onClick={() => handleStatusChange(order._id, "pending")}
                >
                  Set as Pending
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

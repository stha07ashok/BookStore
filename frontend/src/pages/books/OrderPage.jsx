import React from "react";
import { useGetOrderByEmailQuery } from "../../redux/features/orders/ordersApi";
import { useAuth } from "../../context/AuthContext";
import { useDeleteOrderMutation } from "../../redux/features/orders/ordersApi";
import Swal from "sweetalert2";

const OrderPage = () => {
  const { currentUser } = useAuth();

  const {
    data: orders = [],
    isLoading,
    isError,
  } = useGetOrderByEmailQuery(currentUser.email);

  const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error getting orders data</div>;

  const handleDelete = async (orderId) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This action cannot be undone!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        await deleteOrder(orderId).unwrap();
        Swal.fire(
          "Deleted!",
          "Your order has been deleted successfully.",
          "success"
        );
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      Swal.fire("Error", "Failed to delete the order", "error");
    }
  };

  // Function to determine the status text color
  const getStatusTextColor = (status) => {
    switch (status) {
      case "Delivered":
        return "text-green-500";
      case "Rejected":
        return "text-red-500";
      case "On the way":
        return "text-violet-500";
      default:
        return "text-yellow-500";
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6 text-center">Your Orders</h2>

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

              <div className="my-3 flex gap-4 flex-wrap justify-between">
                <button
                  onClick={() => handleDelete(order._id)}
                  className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-700 transition duration-300 border-1 border-black dark:border-white dark:text-black"
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>

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
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderPage;

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
  } = useGetOrderByEmailQuery(encodeURIComponent(currentUser.email));

  const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation();

  if (isLoading) return <div>Loading...</div>;

  if (isError) {
    return <div>No Order Found!!</div>;
  }

  const activeOrders = orders.filter((order) => !order.isDeleted);

  if (isError) {
    return <div className="text-center py-10 ">No Order Found!!</div>;
  }
  const handleDelete = async (orderId) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This action will delete the order!",
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
      console.error("Error hiding order:", error);
      Swal.fire("Error", "Failed to hide the order", "error");
    }
  };

  // Function to determine the status text color
  const getStatusTextColor = (status) => {
    switch (status) {
      case "Delivered":
        return "text-green-500";
      case "On the way":
        return "text-violet-500";
      default:
        return "text-yellow-500";
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6 text-center">Your Orders</h2>

      {activeOrders.length === 0 ? (
        <div className="text-center text-gray-500">No active orders found!</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeOrders.map((order, index) => (
            <div
              key={order._id}
              className="bg-white shadow-md rounded-lg p-6 border-2 border-gray-300 dark:border-white group dark:bg-gray-800 transition-transform transform hover:scale-105"
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
              <p className="text-sm text-gray-600 dark:text-white ">
                <span className="font-semibold">Payment Method:</span>{" "}
                {order.paymentMethod}
                {order.paymentMethod === "Esewa" && (
                  <span className="text-green-500 font-bold ml-2">
                    (Payment is completed!!)
                  </span>
                )}
              </p>
              <p className="text-sm text-gray-600 dark:text-white">
                <span className="font-semibold">Total Price:</span> Rs.
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
                  Books Ordered:
                </h4>
                <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-white">
                  {order.bookTitle.map((title, index) => (
                    <li key={index}>
                      {title} (x{order.quantity[index]})
                    </li>
                  ))}
                </ul>
              </div>

              <div className="my-3 flex justify-between items-center">
                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(order._id)}
                  className={`text-white font-bold py-2 px-4 rounded transition duration-300 border-1 border-black dark:border-white ${
                    order.status === "On the way"
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-500 hover:bg-red-700"
                  }`}
                  disabled={order.status === "On the way"}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>

                {/* Status Display */}
                <div className="flex gap-1 items-center">
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

              {/* Note for "On the way" Status */}
              {order.status === "On the way" && (
                <p className="text-xs text-gray-500 mt-2 text-center">
                  If you want to delete this order, please contact the store
                  directly at{" "}
                  <span className="font-semibold text-black dark:text-white">
                    9866149959
                  </span>
                  .
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderPage;

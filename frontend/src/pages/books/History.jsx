import React from "react";
import { useGetAllOrdersQuery } from "../../redux/features/orders/ordersApi";
import { useGetAllSoldBooksQuery } from "../../redux/features/soldOldBooks/old.book.api";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";

const HistoryPage = () => {
  const { currentUser } = useAuth();

  const {
    data: orders = [],
    isLoading: isOrdersLoading,
    isError: ordersError,
  } = useGetAllOrdersQuery(currentUser.email);

  const {
    data: soldBooks = [],
    isLoading: isSoldBooksLoading,
    isError: soldBooksError,
  } = useGetAllSoldBooksQuery(currentUser.email);

  // Log to debug data
  console.log("Orders:", orders);
  console.log("Sold Books:", soldBooks);

  if (isOrdersLoading || isSoldBooksLoading) {
    return <div>Loading...</div>;
  }

  if (ordersError || soldBooksError) {
    console.log("Orders Error:", ordersError);
    console.log("Sold Books Error:", soldBooksError);
    return <div>Error loading data</div>;
  }

  const handleDeleteOrder = async (orderId) => {
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
        Swal.fire("Deleted!", "Your order has been deleted.", "success");
      }
    } catch (error) {
      Swal.fire("Error", "Failed to delete the order", "error");
    }
  };

  const handleDeleteSoldBook = async (bookId) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This will permanently delete the book from your sold list.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
      });

      if (result.isConfirmed) {
        Swal.fire("Deleted!", "Your book has been deleted.", "success");
      }
    } catch (error) {
      Swal.fire("Error", "Failed to delete the book", "error");
    }
  };

  const combinedHistory = [
    ...orders.map((order) => ({
      _id: `order-${order._id}`,
      itemType: "Order",
      details: order,
      date: order.createdAt,
      isDeleted: order.isDeleted,
      handleDelete: () => handleDeleteOrder(order._id),
    })),

    ...soldBooks.data.map((book) => ({
      _id: `sold-book-${book._id}`,
      itemType: "Sold Book",
      details: book,
      date: book.createdAt,
      handleDelete: () => handleDeleteSoldBook(book._id),
    })),
  ];

  const getStatusTextColor = (status) => {
    switch (status) {
      case "Delivered":
        return "text-green-700";
      case "Rejected":
        return "text-red-700";
      case "Pending":
        return "text-yellow-700";
      case "On the way":
        return "text-violet-700";
      case "Sold":
        return "text-green-700";
      case "Processing":
        return "text-violet-700";
      default:
        return "text-gray-700";
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6 text-center">Your History</h2>

      {combinedHistory.length === 0 ? (
        <div className="text-center text-gray-500">No history available</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {combinedHistory.map((record) => (
            <div
              key={record._id}
              className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 border-2 border-gray-300 dark:border-white"
            >
              <h3 className="font-semibold text-lg text-gray-800 dark:text-white">
                {record.itemType}
              </h3>
              {record.itemType === "Order" ? (
                <div className="text-sm mt-2 text-gray-800 dark:text-white">
                  <p>
                    <strong>Name:</strong> {record.details.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {record.details.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {record.details.phone}
                  </p>
                  <p>
                    <strong>Address:</strong>{" "}
                    {`${record.details.address.city}, ${record.details.address.state}, ${record.details.address.country}, ${record.details.address.zipcode}`}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span className={getStatusTextColor(record.details.status)}>
                      {record.details.status}
                    </span>
                  </p>
                </div>
              ) : (
                <div className="text-sm mt-2 text-gray-800 dark:text-white">
                  <p>
                    <strong>Book Title:</strong> {record.details.title}
                  </p>
                  <p>
                    <strong>Author:</strong> {record.details.author}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span className={getStatusTextColor(record.details.status)}>
                      {record.details.status}
                    </span>
                  </p>
                </div>
              )}

              <p className="text-sm text-gray-600 mt-4 dark:text-white">
                Date: {new Date(record.date).toLocaleString()}
              </p>
              <button
                onClick={record.handleDelete}
                className="bg-red-500 text-white py-1 px-3 rounded mt-4 hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;

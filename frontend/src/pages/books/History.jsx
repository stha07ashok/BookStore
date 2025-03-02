import React from "react";
import { useGetAllOrdersByEmailQuery } from "../../redux/features/orders/ordersApi";
import { useAuth } from "../../context/AuthContext";
import { useGetAllSoldBooksByEmailQuery } from "../../redux/features/soldOldBooks/old.book.api";

const HistoryPage = () => {
  const { currentUser } = useAuth();

  // Fetch orders and sold books using the updated queries
  const {
    data: orders = [], // Default to an empty array if no data is returned
    isLoading: isOrdersLoading,
    isError: ordersError,
  } = useGetAllOrdersByEmailQuery(currentUser.email);

  const {
    data: soldBooks = [], // Default to an empty array if no data is returned
    isLoading: isSoldBooksLoading,
    isError: soldBooksError,
  } = useGetAllSoldBooksByEmailQuery(currentUser.email);

  console.log("Orders: ", orders); // Debug orders data
  console.log("Sold Books: ", soldBooks); // Debug soldBooks data

  // Handle loading state
  if (isOrdersLoading || isSoldBooksLoading) {
    return <div>Loading...</div>;
  }

  // Handle error states separately for orders and sold books
  if (ordersError && soldBooksError) {
    return <div>No History available!!</div>;
  }

  // Combine orders and sold books history
  const combinedHistory = [
    ...(Array.isArray(orders) && orders.length > 0 ? orders : []).map(
      (order) => ({
        _id: `order-${order._id}`,
        itemType: "Your Order",
        details: order,
        date: order.createdAt,
        isDeleted: order.isDeleted,
        handleDelete: () => handleDeleteOrder(order._id),
      })
    ),

    ...(Array.isArray(soldBooks) && soldBooks.length > 0 ? soldBooks : []).map(
      (book) => ({
        _id: `sold-book-${book._id}`,
        itemType: "Your Sold Book",
        details: book,
        date: book.createdAt,
        handleDelete: () => handleDeleteSoldBook(book._id),
      })
    ),
  ];

  console.log("Combined History: ", combinedHistory); // Debug combined history

  // Function to determine status text color
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

  // Handle delete actions for orders and sold books
  const handleDeleteOrder = (orderId) => {
    console.log("Deleting order with ID:", orderId);
  };

  const handleDeleteSoldBook = (bookId) => {
    console.log("Deleting sold book with ID:", bookId);
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
              {record.itemType === "Your Order" ? (
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
                    <strong>Address:</strong> {`${record.details.address}`}
                  </p>
                  <p>
                    <strong>Book Type:</strong> {record.details.type}
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;

import React from "react";
import { useGetAllOrdersByEmailQuery } from "../../redux/features/orders/ordersApi";
import { useAuth } from "../../context/AuthContext";
import { useGetAllSoldBooksByEmailQuery } from "../../redux/features/soldOldBooks/old.book.api";

const HistoryPage = () => {
  const { currentUser } = useAuth();

  // Fetch orders and sold books using the updated queries
  const {
    data: orders = [],
    isLoading: isOrdersLoading,
    isError: ordersError,
  } = useGetAllOrdersByEmailQuery(currentUser.email);

  const {
    data: soldBooks = [],
    isLoading: isSoldBooksLoading,
    isError: soldBooksError,
  } = useGetAllSoldBooksByEmailQuery(currentUser.email);

  console.log("Orders: ", orders);
  console.log("Sold Books: ", soldBooks);

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
        paymentMethod: order.paymentMethod,
        totalPrice: order.totalPrice,
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

  console.log("Combined History: ", combinedHistory);

  // Function to determine status text color
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
      case "Sold":
        return "text-green-500";
      case "Processing":
        return "text-violet-500";
      case "Order is deleted!!":
        return "text-red-500";
      case "Book is deleted!!":
        return "text-red-500";
      default:
        return "text-gray-500";
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
                    <strong>Payment Method:</strong>{" "}
                    {record.details.paymentMethod}
                    {record.details.paymentMethod === "Esewa" && (
                      <span className="text-green-500 font-bold ml-2">
                        (Payment is completed!!)
                      </span>
                    )}
                  </p>
                  <p>
                    <strong>Total Price:</strong> Rs.{record.details.totalPrice}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      className={`${getStatusTextColor(
                        record.details.status
                      )} font-bold`}
                    >
                      {record.details.status}
                    </span>
                  </p>
                  {Array.isArray(record.details.bookTitle) &&
                    record.details.bookTitle.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-semibold text-md text-black dark:text-white">
                          Books Ordered:
                        </h4>
                        <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-white">
                          {record.details.bookTitle.map((title, index) => (
                            <li key={index}>
                              {title} (x{record.details.quantity?.[index] ?? 1})
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
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
                    <span
                      className={`${getStatusTextColor(
                        record.details.status
                      )} font-bold`}
                    >
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

import React from "react";
import {
  useGetAllSoldBooksQuery,
  useUpdateOldBookMutation,
  useDeleteOldBookMutation, // Import delete mutation
} from "../../../redux/features/soldOldBooks/old.book.api";

const SoldOldBooks = () => {
  const { data: response, error, isLoading } = useGetAllSoldBooksQuery();
  const [updateOldBook] = useUpdateOldBookMutation();
  const [deleteOldBook] = useDeleteOldBookMutation(); // Define delete function

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading sold books</div>;

  const soldBooks =
    response?.data && Array.isArray(response.data) ? response.data : [];

  const handleStatusChange = async (id, newStatus) => {
    await updateOldBook({ id, updatedBook: { status: newStatus } });
  };

  const handleDelete = async (id) => {
    await deleteOldBook(id);
  };

  const getStatusTextColor = (status) => {
    switch (status) {
      case "Pending":
        return "text-yellow-500";
      case "Sold":
        return "text-green-500";
      case "Rejected":
        return "text-red-500";
      case "Processing":
        return "text-violet-500";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold text-center mb-6">Sold Books</h1>
      {soldBooks.length === 0 ? (
        <div className="text-center text-gray-600">No sold books available</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {soldBooks.map((book, index) => (
            <div
              key={book._id || index}
              className="bg-white shadow-md rounded-lg p-6 border-2 border-black dark:border-white group dark:bg-gray-800 transition-transform transform hover:scale-105"
            >
              <img
                src={book.image || "https://via.placeholder.com/150"}
                alt={book.title || "Book Image"}
                className="h-64 w-64 object-cover"
              />
              <div className="p-4">
                {book.title && (
                  <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                    {book.title}
                  </h2>
                )}
                {book.author && (
                  <p className="text-gray-600 dark:text-gray-300">
                    <span className="font-semibold">Author:</span> {book.author}
                  </p>
                )}
                {book.edition && (
                  <p className="text-gray-600 dark:text-gray-300">
                    <span className="font-semibold">Book Edition:</span>{" "}
                    {book.edition}
                  </p>
                )}
                {book.type && (
                  <p className="text-gray-600 dark:text-gray-300">
                    <span className="font-semibold">Book Type:</span>{" "}
                    {book.type}
                  </p>
                )}

                {/* Display additional information */}
                {book.email && (
                  <p className="text-gray-600 dark:text-gray-300">
                    <span className="font-semibold">Email:</span> {book.email}
                  </p>
                )}
                {book.contactNumber && (
                  <p className="text-gray-600 dark:text-gray-300">
                    <span className="font-semibold">Contact Number:</span>{" "}
                    {book.contactNumber}
                  </p>
                )}
                {book.address && (
                  <p className="text-gray-600 dark:text-gray-300">
                    <span className="font-semibold">Address:</span>{" "}
                    {book.address}
                  </p>
                )}

                {/* Status Display with Dynamic Text Color */}
                <div className="mt-4 flex gap-1 items-center">
                  <h4 className="font-semibold text-md text-black dark:text-white">
                    Status:
                  </h4>
                  <span
                    className={`text-sm font-semibold ${getStatusTextColor(
                      book.status
                    )}`}
                  >
                    {book.status}
                  </span>
                </div>

                {/* Status Change Buttons */}
                <div className="mt-4 flex flex-wrap items-center gap-2 ">
                  <button
                    onClick={() => handleStatusChange(book._id, "Pending")}
                    className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => handleStatusChange(book._id, "Sold")}
                    className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                  >
                    Sold
                  </button>
                  <button
                    onClick={() => handleStatusChange(book._id, "Rejected")}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Rejected
                  </button>
                  <button
                    onClick={() => handleStatusChange(book._id, "Processing")}
                    className="bg-violet-500 text-white px-3 py-1 rounded"
                  >
                    Processing
                  </button>
                </div>

                {/* Delete Button - Only if status is "Sold" */}
                <div className="mt-4">
                  <button
                    onClick={() => handleDelete(book._id)}
                    className={`w-full text-white font-bold py-2 px-4 rounded transition duration-300 ${
                      book.status === "Sold"
                        ? "bg-red-500 hover:bg-red-700"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                    disabled={book.status !== "Sold"}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SoldOldBooks;

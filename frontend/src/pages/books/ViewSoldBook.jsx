import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";
import {
  useDeleteOldBookMutation,
  useGetSoldBookByEmailQuery,
} from "../../redux/features/soldOldBooks/old.book.api";

const SoldBooksPage = () => {
  const { currentUser } = useAuth();
  const {
    data: soldBooks = [],
    isLoading,
    isError,
  } = useGetSoldBookByEmailQuery(currentUser.email);

  const [deleteSoldBook, { isLoading: isDeleting }] =
    useDeleteOldBookMutation(); // Corrected here

  if (isLoading) return <div>Loading...</div>;

  if (isError) return <div>No Sold Books Found!</div>;

  // Filter out deleted books if there's a `isDeleted` flag
  const activeSoldBooks = soldBooks.filter((book) => !book.isDeleted);

  const handleDelete = async (bookId) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This action will delete the sold book!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        await deleteSoldBook(bookId).unwrap();
        Swal.fire(
          "Deleted!",
          "Your sold book has been deleted successfully.",
          "success"
        );
      }
    } catch (error) {
      console.error("Error hiding sold book:", error);
      Swal.fire("Error", "Failed to hide the book", "error");
    }
  };

  // Function to determine the status text color
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
      <h1 className="text-3xl font-semibold text-center mb-6">
        Your Sold Books
      </h1>

      {activeSoldBooks.length === 0 ? (
        <div className="text-center text-gray-600">No sold books available</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeSoldBooks.map((book, index) => (
            <div
              key={book._id || index}
              className="bg-white shadow-md rounded-lg p-6 border-2 border-gray-300 dark:border-white group dark:bg-gray-800 transition-transform transform hover:scale-105"
            >
              <img
                src={book.image || "https://via.placeholder.com/150"}
                alt={book.title || "Book Image"}
                className="h-72 w-64 object-fill"
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
              </div>
              <div className="my-3 flex justify-between items-center">
                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(book._id)}
                  className={`text-white font-bold py-2 px-4 rounded transition duration-300 border-1 border-black dark:border-white ${
                    book.status === "Processing"
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-500 hover:bg-red-700"
                  }`}
                  disabled={book.status === "Processing"}
                >
                  Delete
                </button>

                {/* Status Display */}
                <div className="flex gap-1 items-center">
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
              </div>

              {/* Note for Processing Status */}
              {book.status === "Processing" && (
                <p className="text-xs dark:text-white-500 mt-2 text-center">
                  <span className="font-bold">Note:</span> If you want to delete
                  this book, please contact the store directly at{" "}
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

export default SoldBooksPage;

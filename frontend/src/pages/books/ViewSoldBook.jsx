import React from "react";
import { useGetAllSoldBooksQuery } from "../../redux/features/soldOldBooks/old.book.api";
import { useAuth } from "../../context/AuthContext";
import { useDeleteOldBookMutation } from "../../redux/features/soldOldBooks/old.book.api";
import Swal from "sweetalert2";

const ViewSoldBook = () => {
  const { currentUser } = useAuth();
  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useGetAllSoldBooksQuery(currentUser?.email, { skip: !currentUser });

  const [deleteOldBook] = useDeleteOldBookMutation();

  if (isLoading) return <div className="text-center py-10">Loading...</div>;
  if (isError) {
    console.error("Error fetching sold books:", error);
    return (
      <div className="text-center py-10 text-red-600">
        Error getting sold books data
      </div>
    );
  }

  // Safely access the data array
  const booksArray = Array.isArray(response?.data) ? response.data : [];

  const handleDelete = async (bookId) => {
    try {
      // Show confirmation dialog with SweetAlert
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This will permanently delete the book from your sold list.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
      });

      // Proceed if the user confirms
      if (result.isConfirmed) {
        await deleteOldBook(bookId).unwrap();

        // Show success message if the deletion is successful
        Swal.fire({
          title: "Deleted!",
          text: "Your book has been deleted.",
          icon: "success",
          confirmButtonText: "Okay",
        });
      }
    } catch (error) {
      console.error("Error deleting book:", error);

      // Show error message if the deletion fails
      Swal.fire({
        title: "Error!",
        text: "Failed to delete the book. Please try again.",
        icon: "error",
        confirmButtonText: "Try Again",
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold text-center mb-6">
        Your Sold Books
      </h1>

      {booksArray.length === 0 ? (
        <div className="text-center text-gray-600">No sold books available</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {booksArray.map((book, index) => (
            <div
              key={book._id || index}
              className="bg-white shadow-md rounded-lg p-6 border-2 border-black dark:border-white group dark:bg-gray-800 transition-transform transform hover:scale-105"
            >
              <img
                src={book.image || "https://via.placeholder.com/150"}
                alt={book.title || "Book Image"}
                className="h-48 w-full object-cover"
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
              </div>
              <div className="my-3">
                <button
                  onClick={() => handleDelete(book._id)}
                  className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-700 transition duration-300 border-1 border-black dark:border-white"
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

export default ViewSoldBook;

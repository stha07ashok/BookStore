import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetAllSoldBooksQuery,
  useUpdateOldBookMutation,
} from "../../../redux/features/soldOldBooks/old.book.api";

const SoldBooksByEmail = () => {
  const { email } = useParams();
  const navigate = useNavigate();
  const { data: response = [], error, isLoading } = useGetAllSoldBooksQuery();

  const soldBooks = Array.isArray(response)
    ? response
    : Array.isArray(response?.data)
    ? response.data
    : [];
  const [updateOldBook] = useUpdateOldBookMutation();
  const [newSoldBooks, setNewSoldBooks] = useState({});

  useEffect(() => {
    const seenSoldBooks =
      JSON.parse(localStorage.getItem(`seenSoldBooks_${email}`)) || [];
    const currentSoldBookIds = soldBooks
      .filter((book) => book.email === email)
      .map((book) => book._id);
    const detectedNew = {};
    currentSoldBookIds.forEach((id) => {
      if (!seenSoldBooks.includes(id)) {
        detectedNew[id] = true;
      }
    });
    setNewSoldBooks(detectedNew);
  }, [soldBooks, email]);

  useEffect(() => {
    const currentSoldBookIds = soldBooks
      .filter((book) => book.email === email)
      .map((book) => book._id);
    if (currentSoldBookIds.length > 0) {
      localStorage.setItem(
        `seenSoldBooks_${email}`,
        JSON.stringify(currentSoldBookIds)
      );
    }
  }, [soldBooks, email]);

  const handleStatusChange = async (bookId, status) => {
    try {
      await updateOldBook({ id: bookId, updatedBook: { status } });
      console.log(`Sold book ${bookId} status updated to ${status}`);
    } catch (err) {
      console.error("Error updating sold book status:", err);
    }
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

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading sold books</div>;

  const filteredSoldBooks = soldBooks
    .filter((book) => book.email === email)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="container mx-auto p-6">
      <button
        className="text-blue-500 mb-4 border-2 border-gray-300 mx-3 my-3 px-3 py-3 rounded-md shadow-md"
        onClick={() => navigate(-1)}
      >
        Back
      </button>
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Sold Books for {email}
      </h2>

      {filteredSoldBooks.length === 0 ? (
        <div className="text-center text-gray-500">No sold books found!</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {filteredSoldBooks.map((book, index) => (
            <div
              key={book._id}
              className="relative bg-white shadow-md rounded-lg p-6 border-2 border-black dark:border-white group dark:bg-gray-800 transition-transform transform hover:scale-105"
            >
              {newSoldBooks[book._id] && (
                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  New!
                </span>
              )}
              <p className="p-1 bg-secondary text-white w-10 rounded mb-2">
                #{index + 1}
              </p>
              {book.title && (
                <h3 className="font-bold text-lg text-black dark:text-white mb-2">
                  {book.title}
                </h3>
              )}
              {book.author && (
                <p className="text-sm text-gray-600 dark:text-white">
                  <span className="font-semibold">Author:</span> {book.author}
                </p>
              )}
              {book.edition && (
                <p className="text-sm text-gray-600 dark:text-white">
                  <span className="font-semibold">Edition:</span> {book.edition}
                </p>
              )}
              {book.type && (
                <p className="text-sm text-gray-600 dark:text-white">
                  <span className="font-semibold">Type:</span> {book.type}
                </p>
              )}
              {book.email && (
                <p className="text-sm text-gray-600 dark:text-white">
                  <span className="font-semibold">Email:</span> {book.email}
                </p>
              )}
              {book.contactNumber && (
                <p className="text-sm text-gray-600 dark:text-white">
                  <span className="font-semibold">Contact Number:</span>{" "}
                  {book.contactNumber}
                </p>
              )}
              {book.address && (
                <p className="text-sm text-gray-600 dark:text-white">
                  <span className="font-semibold">Address:</span> {book.address}
                </p>
              )}
              <div className="mt-4 flex gap-1 items-center">
                <h4 className="font-semibold text-md text-black dark:text-white">
                  Status:
                </h4>
                <span
                  className={`text-sm font-semibold ${getStatusTextColor(
                    book.status
                  )}`}
                >
                  {book.status || "Pending"}
                </span>
              </div>
              <div className="mt-4 gap-4 grid md:grid-cols-2 sm:grid-cols-1 lg:grid-cols-2 justify-center">
                <button
                  className="bg-green-500 text-white font-bold py-1 px-3 rounded hover:bg-green-700 transition duration-300"
                  onClick={() => handleStatusChange(book._id, "Sold")}
                >
                  Mark as Sold
                </button>
                <button
                  className="bg-red-500 text-white font-bold py-1 px-3 rounded hover:bg-red-700 transition duration-300"
                  onClick={() => handleStatusChange(book._id, "Rejected")}
                >
                  Reject
                </button>
                <button
                  className="bg-yellow-500 text-white font-bold py-1 px-3 rounded hover:bg-yellow-700 transition duration-300"
                  onClick={() => handleStatusChange(book._id, "Pending")}
                >
                  Set as Pending
                </button>
                <button
                  className="bg-violet-500 text-white font-bold py-1 px-3 rounded hover:bg-purple-700 transition duration-300"
                  onClick={() => handleStatusChange(book._id, "Processing")}
                >
                  Processing
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SoldBooksByEmail;

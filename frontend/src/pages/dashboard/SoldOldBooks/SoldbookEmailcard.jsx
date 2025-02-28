import React, { useEffect, useState } from "react";
import { useGetAllSoldBooksQuery } from "../../../redux/features/soldOldBooks/old.book.api";
import { useNavigate } from "react-router-dom";

const GetAllSoldBooks = () => {
  const { data: response = [], error, isLoading } = useGetAllSoldBooksQuery();

  // Ensure soldBooks is always an array regardless of API response shape.
  const soldBooks = Array.isArray(response)
    ? response
    : Array.isArray(response?.data)
    ? response.data
    : [];

  const navigate = useNavigate();
  const [newSoldBooks, setNewSoldBooks] = useState({});

  useEffect(() => {
    // Get the previously stored sold book counts and new flags from localStorage.
    const prevSoldBookCounts =
      JSON.parse(localStorage.getItem("soldBookCounts")) || {};
    const prevNewSoldBooks =
      JSON.parse(localStorage.getItem("newSoldBooks")) || {};

    // Calculate current sold book counts by email.
    const currentSoldBookCounts = soldBooks.reduce((acc, book) => {
      acc[book.email] = (acc[book.email] || 0) + 1;
      return acc;
    }, {});

    // Detect new sold books (if the count increased compared to previous).
    const detectedNewSoldBooks = {};
    for (const email in currentSoldBookCounts) {
      if (currentSoldBookCounts[email] > (prevSoldBookCounts[email] || 0)) {
        detectedNewSoldBooks[email] = true;
      } else {
        detectedNewSoldBooks[email] = prevNewSoldBooks[email] || false;
      }
    }
    setNewSoldBooks(detectedNewSoldBooks);
    localStorage.setItem(
      "soldBookCounts",
      JSON.stringify(currentSoldBookCounts)
    );
    if (Object.keys(detectedNewSoldBooks).length > 0) {
      localStorage.setItem(
        "newSoldBooks",
        JSON.stringify(detectedNewSoldBooks)
      );
    }
  }, [soldBooks]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading sold books</div>;

  // Count sold books per email.
  const emailSoldBookCounts = soldBooks.reduce((acc, book) => {
    acc[book.email] = (acc[book.email] || 0) + 1;
    return acc;
  }, {});
  const uniqueEmails = Object.keys(emailSoldBookCounts);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Sold Books by Email
      </h2>

      {uniqueEmails.length === 0 ? (
        <div className="text-center text-gray-500">No sold books found!</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {uniqueEmails.map((email) => (
            <div
              key={email}
              className="cursor-pointer bg-white shadow-md p-6 rounded-lg border border-gray-300 hover:bg-gray-100 transition relative flex justify-between items-center"
              onClick={() => {
                // Navigate to the correct route as defined in your router.
                navigate(
                  `/dashboard/soldoldbooksbyemail/${encodeURIComponent(email)}`
                );
                // Mark this email as seen (remove "New!" flag) in both state and localStorage.
                setNewSoldBooks((prev) => ({ ...prev, [email]: false }));
                localStorage.setItem(
                  "newSoldBooks",
                  JSON.stringify({ ...newSoldBooks, [email]: false })
                );
              }}
            >
              <h3 className="text-lg font-semibold text-black">{email}</h3>
              <div className="flex gap-2 items-center">
                <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {emailSoldBookCounts[email]}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GetAllSoldBooks;

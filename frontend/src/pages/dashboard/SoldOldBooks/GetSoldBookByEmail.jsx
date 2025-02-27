import React, { useEffect, useState } from "react";
import { useGetAllSoldBooksHistoryQuery } from "../../../redux/features/soldOldBooks/old.book.api";
import { useNavigate } from "react-router-dom";

const GetAllSoldBooks = () => {
  const {
    data: soldBooks = [],
    error,
    isLoading,
  } = useGetAllSoldBooksHistoryQuery();
  const navigate = useNavigate();
  const [newBooks, setNewBooks] = useState({});

  useEffect(() => {
    const prevSoldBookCounts =
      JSON.parse(localStorage.getItem("soldBookCounts")) || {};

    const currentSoldBookCounts = soldBooks.reduce((acc, book) => {
      acc[book.email] = (acc[book.email] || 0) + 1;
      return acc;
    }, {});

    const detectedNewBooks = {};
    for (const email in currentSoldBookCounts) {
      if (currentSoldBookCounts[email] > (prevSoldBookCounts[email] || 0)) {
        detectedNewBooks[email] = true;
      }
    }
    setNewBooks(detectedNewBooks);
    localStorage.setItem(
      "soldBookCounts",
      JSON.stringify(currentSoldBookCounts)
    );
  }, [soldBooks]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading sold books</div>;

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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {uniqueEmails.map((email) => (
            <div
              key={email}
              className="cursor-pointer bg-white shadow-md p-6 rounded-lg border border-gray-300 hover:bg-gray-100 transition relative flex justify-between items-center"
              onClick={() => {
                navigate(
                  `/dashboard/soldbooksbyemail/${encodeURIComponent(email)}`
                );

                setNewBooks((prev) => ({ ...prev, [email]: false }));
              }}
            >
              <h3 className="text-lg font-semibold text-black">{email}</h3>

              <div className="flex gap-2 items-center">
                <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {emailSoldBookCounts[email]}
                </span>

                {newBooks[email] && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    New!
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GetAllSoldBooks;

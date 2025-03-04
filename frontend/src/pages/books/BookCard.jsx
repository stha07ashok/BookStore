import React from "react";
import { getImgUrl } from "../../utils/getimgurl";
import { Link } from "react-router-dom";

const BookCard = ({ book }) => {
  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-4 rounded-lg shadow-md transition-shadow duration-300 hover:shadow-lg h-[300px] md:h-[320px] flex flex-col justify-between">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6 items-center">
        {/* Book Image */}
        <div className="w-full sm:w-auto">
          <Link to={`/book/${book._id}`}>
            <img
              src={getImgUrl(book.coverImage) || "/fallback-image.jpg"}
              alt={book.title || "Book Cover"}
              className="w-full h-48 sm:h-52 object-cover rounded-md border border-gray-300 dark:border-gray-700 hover:scale-105 transition-transform duration-200"
            />
          </Link>
        </div>

        {/* Book Details */}
        <div className="flex flex-col justify-between w-full">
          <div className="sm:block md:block">
            <Link to={`/book/${book._id}`}>
              <h3 className=" sm:text-lg text-sm font-normal md:font-semibold hover:text-blue-600 dark:hover:text-blue-400 mb-2">
                {book.title}
              </h3>
            </Link>

            {/* Hide extra details on mobile & tablet */}
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-md mb-4 hidden md:block">
              {book.description.length > 80
                ? `${book.description.slice(0, 50)}.....`
                : book.description}
            </p>

            <p className="font-medium mb-3 text-sm sm:text-base hidden md:block">
              Rs.{book?.newPrice}{" "}
              <span className="line-through font-normal ml-2 text-gray-500 dark:text-gray-400">
                Rs.{book?.oldPrice}
              </span>
            </p>

            <p className="text-sm sm:text-base hidden md:block">
              <span className="font-semibold text-md text-gray-700 dark:text-gray-300">
                Book Type:
              </span>{" "}
              {book?.bookType}
            </p>

            <p className="text-sm sm:text-base mb-4 hidden md:block">
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                No of items:
              </span>{" "}
              {book.itemsnumber}
            </p>
          </div>

          <button
            className={`w-full md:w-auto py-2 px-4 text-sm sm:text-base items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 ${
              book.itemsnumber > 0
                ? "bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white"
                : "bg-gray-400 dark:bg-gray-500 text-gray-500 dark:text-gray-300 cursor-not-allowed"
            } hidden md:flex`}
            disabled={book.itemsnumber === 0}
          >
            {book.itemsnumber > 0 ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;

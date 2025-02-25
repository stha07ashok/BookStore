import React, { useState } from "react";
import { FiShoppingCart } from "react-icons/fi";
import { getImgUrl } from "../../utils/getimgurl";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/carts/cartSlice";
import { useUpdateBookItemsNumberMutation } from "../../redux/features/books/booksApi";

const BookCard = ({ book }) => {
  const dispatch = useDispatch();
  const [itemsLeft, setItemsLeft] = useState(book.itemsnumber);
  const [updateBookItemsNumber, { isLoading }] =
    useUpdateBookItemsNumberMutation();

  const handleAddToCart = async (product) => {
    if (itemsLeft < 1 || isLoading) return;

    try {
      // Update stock on adding to the cart
      await updateBookItemsNumber({
        id: product._id,
        itemsNumber: itemsLeft - 1,
      }).unwrap();

      // Update the local state and Redux store
      setItemsLeft((prev) => prev - 1);
      dispatch(addToCart(product));
    } catch (error) {
      console.error("Error updating item number:", error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-4 rounded-lg shadow-md transition-shadow duration-300 hover:shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 sm:grid-cols-2 gap-6 items-center">
        {/* Book Image */}
        <div className="w-full sm:w-auto">
          <Link to={`/book/${book._id}`}>
            <img
              src={getImgUrl(book.coverImage) || "/fallback-image.jpg"}
              alt={book.title || "Book Cover"}
              className="w-full h-64 sm:h-72 object-cover rounded-md border border-gray-300 dark:border-gray-700 hover:scale-105 transition-transform duration-200"
            />
          </Link>
        </div>

        {/* Book Details */}
        <div className="flex flex-col justify-between">
          <div>
            <Link to={`/book/${book._id}`}>
              <h3 className="text-lg sm:text-xl font-semibold hover:text-blue-600 dark:hover:text-blue-400 mb-2">
                {book.title}
              </h3>
            </Link>
            {/* Description: Hidden on mobile/tablet */}
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base mb-4 sm:block hidden">
              {book.description.length > 80
                ? `${book.description.slice(0, 50)}.....`
                : book.description}
            </p>

            {/* Price Details */}
            <p className="font-medium mb-3 text-sm sm:text-base">
              Rs.{book?.newPrice}{" "}
              <span className="line-through font-normal ml-2 text-gray-500 dark:text-gray-400">
                Rs.{book?.oldPrice}
              </span>
            </p>

            {/* Book Type */}
            <p className="font-medium text-sm sm:text-base mb-2">
              <span className="font-bold text-black dark:text-white">
                Book Type:{" "}
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                {book?.bookType}
              </span>
            </p>

            {/* Stock Info */}
            <p className="font-medium text-sm sm:text-base mb-4">
              <span className="font-bold text-black dark:text-white">
                No of items:{" "}
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                {itemsLeft}
              </span>
            </p>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={() => handleAddToCart(book)}
            disabled={itemsLeft < 1 || isLoading}
            className={`w-full sm:w-auto py-2 px-4 text-sm sm:text-base flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 
              ${
                itemsLeft < 1 || isLoading
                  ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                  : "bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700"
              } text-white`}
          >
            <FiShoppingCart className="text-lg" />
            <span>
              {itemsLeft < 1
                ? "Out of Stock"
                : isLoading
                ? "Adding..."
                : "Add to Cart"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;

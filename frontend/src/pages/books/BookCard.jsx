import React, { useState } from "react";
import { FiShoppingCart } from "react-icons/fi";
import { getImgUrl } from "../../utils/getimgurl";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/carts/cartSlice";
import axios from "axios"; // Import axios for API calls

const BookCard = ({ book }) => {
  const dispatch = useDispatch();
  const [itemsLeft, setItemsLeft] = useState(book.itemsnumber); // Local state for items count

  const handleAddToCart = async (product) => {
    if (itemsLeft >= 1) {
      dispatch(addToCart(product));
      setItemsLeft((prev) => prev - 1); // Update local state

      // Send request to update backend
      try {
        await axios.put(`/api/books/${product._id}`, {
          itemsnumber: itemsLeft - 1,
        });
      } catch (error) {
        console.error("Error updating item number:", error);
      }
    }
  };

  return (
    <div className="transition-shadow duration-300 hover:shadow-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="flex flex-col sm:flex-row sm:items-center sm:h-80 sm:justify-center gap-4">
        {/* Book Image */}
        <div className="sm:h-72 sm:flex-shrink-0 border border-gray-300 dark:border-gray-700 rounded-md">
          <Link to={`/book/${book._id}`}>
            <img
              src={getImgUrl(book.coverImage) || "/fallback-image.jpg"}
              alt={book.title || "Book Cover"}
              className="w-full bg-cover p-2 rounded-md cursor-pointer hover:scale-105 transition-transform duration-200"
            />
          </Link>
        </div>

        {/* Book Details */}
        <div>
          <Link to={`/book/${book._id}`}>
            <h3 className="text-xl font-semibold hover:text-blue-600 dark:hover:text-blue-400 mb-3">
              {book.title}
            </h3>
          </Link>
          <p className="text-gray-600 dark:text-gray-400 mb-5">
            {book.description.length > 80
              ? `${book.description.slice(0, 50)}.....`
              : book.description}
          </p>
          <p className="font-medium mb-5">
            Rs.{book?.newPrice}{" "}
            <span className="line-through font-normal ml-2 text-gray-500 dark:text-gray-400">
              Rs.{book?.oldPrice}
            </span>
          </p>
          <p className="font-medium mb-5">
            <span className="font-normal ml-2 text-gray-500 dark:text-gray-400">
              <span className="font-bold text-black dark:text-white">
                Book Type:{" "}
              </span>
              {book?.bookType}
            </span>
          </p>
          <p className="font-medium mb-5">
            <span className="font-normal ml-2 text-gray-500 dark:text-gray-400">
              <span className="font-bold text-black dark:text-white">
                No of items:{" "}
              </span>
              {itemsLeft}
            </span>
          </p>
          <button
            onClick={() => handleAddToCart(book)}
            disabled={itemsLeft < 1} // Disable button if no items left
            className={`btn-primary px-6 space-x-1 flex items-center gap-1 text-white 
              ${
                itemsLeft < 1
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700"
              }`}
          >
            <FiShoppingCart />
            <span>{itemsLeft < 1 ? "Out of Stock" : "Add to Cart"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;

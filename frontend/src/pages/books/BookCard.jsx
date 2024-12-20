import React from "react";
import { FiShoppingCart } from "react-icons/fi";
import { getImgUrl } from "../../utils/getimgurl";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/carts/cartSlice";

const BookCard = ({ book }) => {
  const dispatch = useDispatch();

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  return (
    <div className=" transition-shadow duration-300 hover:shadow-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="flex flex-col sm:flex-row sm:items-center sm:h-72 sm:justify-center gap-4">
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
              ? `${book.description.slice(0, 80)}.....`
              : book.description}
          </p>
          <p className="font-medium mb-5">
            ${book?.newPrice}{" "}
            <span className="line-through font-normal ml-2 text-gray-500 dark:text-gray-400">
              ${book?.oldPrice}
            </span>
          </p>
          <button
            onClick={() => handleAddToCart(book)}
            className="btn-primary px-6 space-x-1 flex items-center gap-1 bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700"
          >
            <FiShoppingCart />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;

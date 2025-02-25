import React, { useState } from "react";
import { FiShoppingCart } from "react-icons/fi";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getImgUrl } from "../../utils/getimgurl";
import { addToCart } from "../../redux/features/carts/cartSlice";
import {
  useFetchBookByIdQuery,
  useUpdateBookItemsNumberMutation,
} from "../../redux/features/books/booksApi";

const SingleBook = () => {
  const { id } = useParams();
  const { data: book, isLoading, isError } = useFetchBookByIdQuery(id);
  const dispatch = useDispatch();
  const [itemsLeft, setItemsLeft] = useState(book?.itemsnumber || 0);
  const [updateBookItemsNumber, { isLoading: isUpdating }] =
    useUpdateBookItemsNumberMutation();

  const handleAddToCart = async (product) => {
    if (itemsLeft < 1 || isUpdating) return; // Prevent adding if out of stock or request is in progress

    try {
      // Send API request to update stock
      await updateBookItemsNumber({
        id: product._id,
        itemsNumber: itemsLeft - 1,
      }).unwrap();
      // If API update is successful, update local state & Redux store
      setItemsLeft((prev) => prev - 1);
      dispatch(addToCart(product));
    } catch (error) {
      console.error("Error updating item number:", error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error occurred while loading book info</div>;

  return (
    <div className="max-w-lg shadow-md p-5">
      <h1 className="text-2xl font-bold mb-6">{book.title}</h1>

      <div className="">
        <div>
          <img
            src={`${getImgUrl(book.coverImage)}`}
            alt={book.title}
            className="mb-8"
          />
        </div>

        <div className="mb-5 space-y-3">
          <p className="text-gray-700 mb-2 dark:text-white">
            <strong>Author:</strong> {book.author || "admin"}
          </p>
          <p className="text-gray-700 mb-4 dark:text-white">
            <strong>Published:</strong>{" "}
            {new Date(book?.createdAt).toLocaleDateString()}
          </p>
          <p className="text-gray-700 mb-4 capitalize dark:text-white">
            <strong>Category:</strong> {book?.category}
          </p>
          <p className="text-gray-700 dark:text-white">
            <strong>Description:</strong> {book.description}
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
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={() => handleAddToCart(book)}
          disabled={itemsLeft < 1 || isUpdating} // Disable if out of stock or request is in progress
          className={`btn-primary px-6 space-x-1 flex items-center gap-1 text-white 
            ${
              itemsLeft < 1 || isUpdating
                ? "bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 cursor-not-allowed"
                : "bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700"
            }`}
        >
          <FiShoppingCart />
          <span>
            {itemsLeft < 1
              ? "Out of Stock"
              : isUpdating
              ? "Adding..."
              : "Add to Cart"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default SingleBook;

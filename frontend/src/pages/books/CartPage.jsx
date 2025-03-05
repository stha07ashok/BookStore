import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getImgUrl } from "../../utils/getimgurl";
import {
  clearCart,
  removeFromCart,
} from "../../redux/features/carts/cartSlice";
import { useUpdateBookItemsNumberMutation } from "../../redux/features/books/booksApi";

const CartPage = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [updateBookItemsNumber] = useUpdateBookItemsNumberMutation();

  const totalPrice = cartItems
    .reduce((acc, item) => acc + item.newPrice * item.quantity, 0)
    .toFixed(2);

  const handleRemoveFromCart = async (product) => {
    try {
      // Update stock when removing from cart
      const newStock =
        product.itemsnumber !== undefined && product.itemsnumber !== null
          ? product.itemsnumber + product.quantity
          : product.quantity;

      // Update the stock for the book
      await updateBookItemsNumber({
        id: product._id,
        itemsnumber: newStock,
      }).unwrap();

      // Remove item from the cart (the reducer updates localStorage)
      dispatch(removeFromCart(product));
    } catch (error) {
      console.error("Error updating item stock on removal:", error);
    }
  };

  const handleCheckOut = () => {
    navigate("/checkout");
  };

  const handleClearCart = async () => {
    try {
      // Loop through each cart item to update the stock
      for (const product of cartItems) {
        const newStock =
          product.itemsnumber !== undefined && product.itemsnumber !== null
            ? product.itemsnumber + product.quantity
            : product.quantity;

        // Update the stock for the book
        await updateBookItemsNumber({
          id: product._id,
          itemsnumber: newStock,
        }).unwrap();
      }

      // Clear the cart (the reducer updates localStorage)
      dispatch(clearCart());
    } catch (error) {
      console.error("Error updating item stock on clear cart:", error);
    }
  };

  return (
    <div className="flex mt-12 h-full flex-col overflow-hidden bg-white dark:bg-gray-900 shadow-xl dark:text-white border-2 border-gray-300 rounded-md dark:border-white">
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <div className="flex items-start justify-between">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            Shopping cart
          </h2>
          <button
            onClick={handleClearCart}
            className="bg-red-500 text-white rounded-md py-1 px-2 hover:bg-red-600"
          >
            Clear Cart
          </button>
        </div>

        <div className="mt-8">
          {cartItems.length > 0 ? (
            <ul className="-my-6 divide-y divide-gray-200 dark:divide-gray-700">
              {cartItems.map((product) => (
                <li key={product._id} className="flex py-6">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
                    <img
                      src={getImgUrl(product.coverImage)}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="ml-4 flex flex-1 flex-col">
                    <div className="flex justify-between text-base font-medium">
                      <h3>{product.title}</h3>
                      <p>Rs.{product.newPrice}</p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 capitalize">
                      <strong>Category: </strong> {product.category}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex">
                        <strong>Quantity:</strong>
                        <span className="mx-2">{product.quantity}</span>
                      </div>
                      <button
                        onClick={() => handleRemoveFromCart(product)}
                        className="px-2 py-1 border rounded bg-red-500 dark:bg-gray-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              No Products Found
            </p>
          )}
        </div>
      </div>
      <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-6">
        <div className="flex justify-between text-base font-medium">
          <p>Subtotal</p>
          <p>Rs.{totalPrice}</p>
        </div>
        <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
          Shipping and taxes calculated at checkout.
        </p>
        <div className="mt-6 flex items-center justify-center">
          <button
            onClick={handleCheckOut}
            className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700"
          >
            Checkout
          </button>
        </div>
        <div className="mt-6 flex justify-center text-center text-sm">
          <Link to="/">
            <button className="text-indigo-600 hover:text-indigo-500 ml-1">
              Continue Shopping &rarr;
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

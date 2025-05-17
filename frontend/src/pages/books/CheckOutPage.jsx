import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { useAuth } from "../../context/AuthContext";
import { useCreateOrderMutation } from "../../redux/features/orders/ordersApi";
import { clearCart } from "../../redux/features/carts/cartSlice";

const CheckOutPage = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const totalPrice = cartItems
    .reduce((acc, item) => acc + (item.newPrice * item.quantity || 0), 0)
    .toFixed(2);

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const { currentUser } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Initialize dispatch
  const [isChecked, setIsChecked] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");

  const onSubmit = async (data) => {
    if (totalPrice === "0.00" || totalPrice === 0) {
      Swal.fire({
        title: "Error",
        text: "Total amount is not available. Please check your cart.",
        icon: "error",
        confirmButtonText: "Ok",
        confirmButtonColor: "#d33",
      });
      return; // Prevent further execution if total is 0
    }

    const newOrder = {
      name: data.name,
      email: currentUser?.email,
      address: {
        city: data.city,
        country: data.country,
        state: data.state,
        zipcode: data.zipcode,
      },
      phone: data.phone,
      productIds: cartItems.map((item) => item._id),
      totalPrice: totalPrice,
      paymentMethod: paymentMethod,
      bookTitle: cartItems.map((item) => item.title),
      quantity: cartItems.map((item) => item.quantity),
    };

    try {
      // Create the order
      const orderResponse = await createOrder(newOrder).unwrap();
      console.log("Order Response:", orderResponse);

      // Clear the cart after placing the order
      dispatch(clearCart()); // Dispatch the clearCart action to clear the cart

      // If payment method is Esewa, redirect to the payment page
      if (paymentMethod === "Esewa") {
        Swal.fire({
          title: "Order Placed",
          text: "Your order has been placed successfully! Please proceed to payment.",
          icon: "success",
          showCancelButton: false,
          confirmButtonText: "Proceed to Payment",
          confirmButtonColor: "#3085d6",
        }).then((result) => {
          if (result.isConfirmed) {
            // Redirect to the payment page
            navigate("/payment-form", { state: { amount: totalPrice } });
          }
        });
      } else if (paymentMethod === "Cash on Delivery") {
        // If payment method is COD, redirect to order confirmation page
        Swal.fire({
          title: "Order Placed",
          text: "Your order has been placed successfully! Thank you for choosing Cash on Delivery.",
          icon: "success",
        }).then(() => {
          navigate(`/orders`);
        });
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place the order");
    }
  };

  if (isLoading) return <div>Loading....</div>;

  return (
    <section>
      <div className="min-h-screen p-6 flex items-center justify-center bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <div className="container max-w-screen-lg mx-auto">
          <div>
            <h2 className="font-semibold text-xl text-gray-600 mb-2 dark:text-white">
              Make Payment
            </h2>
            <p className="text-gray-500 mb-2 dark:text-white">
              Total Price: Rs.{totalPrice}
            </p>
            <p className="text-gray-500 mb-6 dark:text-white">
              Items: {totalItems > 0 ? totalItems : 0}
            </p>
            <div className="mb-6">
              <h3 className="text-lg font-medium dark:text-white">
                Items in your cart:
              </h3>
              <ul className="list-disc pl-5 text-gray-500 dark:text-white">
                {cartItems.length > 0 ? (
                  cartItems.map((item) => (
                    <li key={item._id} className="text-sm">
                      {item.title} (x{item.quantity})
                    </li>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-white">
                    Your cart is empty.
                  </p>
                )}
              </ul>
            </div>
          </div>

          <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6 dark:bg-gray-900 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-white">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3 my-8"
            >
              <div className="text-gray-600">
                <p className="font-medium text-lg dark:text-white">
                  Personal Details
                </p>
                <p className="dark:text-white">
                  Please fill out all the fields.
                </p>
              </div>

              <div className="lg:col-span-2">
                <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
                  {/* Personal Details Inputs */}
                  <div className="md:col-span-5">
                    <label htmlFor="name">Full Name</label>
                    <input
                      {...register("name", { required: true })}
                      type="text"
                      name="name"
                      id="name"
                      className="h-10 border-2 border-black mt-1 rounded px-4 w-full dark:bg-black dark:text-white dark:border-white"
                    />
                  </div>

                  <div className="md:col-span-5">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="text"
                      name="email"
                      id="email"
                      disabled
                      className="h-10 border-2 border-black mt-1 rounded px-4 w-full dark:bg-black dark:text-white dark:border-white"
                      defaultValue={currentUser?.email}
                      placeholder="email@domain.com"
                    />
                  </div>

                  <div className="md:col-span-5">
                    <label htmlFor="phone">Esewa / Phone Number</label>
                    <input
                      {...register("phone", { required: true })}
                      type="number"
                      name="phone"
                      id="phone"
                      className="h-10 border-2 border-black mt-1 rounded px-4 w-full dark:bg-black dark:text-white dark:border-white"
                      placeholder="+977 98********"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label htmlFor="address">Address / Street</label>
                    <input
                      {...register("address", { required: true })}
                      type="text"
                      name="address"
                      id="address"
                      className="h-10 border-2 border-black mt-1 rounded px-4 w-full dark:bg-black dark:text-white dark:border-white"
                      placeholder="Address"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="city">City</label>
                    <input
                      {...register("city", { required: true })}
                      type="text"
                      name="city"
                      id="city"
                      className="h-10 border-2 border-black mt-1 rounded px-4 w-full dark:bg-black dark:text-white dark:border-white"
                      placeholder="City"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="country">Country / region</label>
                    <div className="h-10 bg-gray-50 flex border border-gray-200 rounded items-center mt-1">
                      <input
                        {...register("country", { required: true })}
                        name="country"
                        id="country"
                        placeholder="Country"
                        className="h-10 border-2 border-black mt-1 rounded px-4 w-full dark:bg-black dark:text-white dark:border-white"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="state">State / province</label>
                    <div className="h-10 bg-gray-50 flex border border-gray-200 rounded items-center mt-1">
                      <input
                        {...register("state", { required: true })}
                        name="state"
                        id="state"
                        placeholder="State"
                        className="h-10 border-2 border-black mt-1 rounded px-4 w-full dark:bg-black dark:text-white dark:border-white"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-1">
                    <label htmlFor="zipcode">Zipcode</label>
                    <input
                      {...register("zipcode", { required: true })}
                      type="text"
                      name="zipcode"
                      id="zipcode"
                      className="h-10 border-2 border-black mt-1 rounded px-4 w-full dark:bg-black dark:text-white dark:border-white"
                      placeholder="Zipcode"
                    />
                  </div>

                  {/* Payment Method Selection */}
                  <div className="md:col-span-5">
                    <label htmlFor="paymentMethod">Payment Method</label>
                    <select
                      {...register("paymentMethod", { required: true })}
                      onChange={(e) => setPaymentMethod(e.target.value)} // Update the payment method state
                      className="h-10 border-2 border-black mt-1 rounded px-4 w-full dark:bg-black dark:text-white dark:border-white"
                    >
                      <option value="">Select Payment Method</option>
                      <option value="Cash on Delivery">Cash on Delivery</option>
                      <option value="Esewa">Esewa</option>
                    </select>
                  </div>

                  {/* Terms & Conditions Checkbox */}
                  <div className="md:col-span-5 mt-3">
                    <div className="inline-flex items-center">
                      <input
                        onChange={(e) => setIsChecked(e.target.checked)}
                        type="checkbox"
                        name="billing_same"
                        id="billing_same"
                        className="w-4 h-4 border border-gray-300 rounded dark:bg-black dark:border-white dark:ring-offset-black"
                      />
                      <label
                        htmlFor="billing_same"
                        className="ml-2 text-gray-600 dark:text-white"
                      >
                        I agree to the{" "}
                        <Link
                          to="/terms"
                          className="underline font-medium text-indigo-500"
                        >
                          Terms and Conditions
                        </Link>
                      </label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="md:col-span-5">
                    <button
                      type="submit"
                      className={`w-full h-10 bg-indigo-600 text-white font-medium rounded-md mt-4 disabled:bg-gray-500 ${
                        !isChecked ? "cursor-not-allowed" : "cursor-pointer"
                      }`}
                      disabled={!isChecked || !paymentMethod}
                    >
                      Place Order
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckOutPage;

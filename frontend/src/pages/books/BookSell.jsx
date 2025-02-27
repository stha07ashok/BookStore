import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAddOldBookMutation } from "../../redux/features/soldOldBooks/old.book.api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../context/AuthContext";

const SellBookPage = ({ darkMode }) => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [message, setMessage] = useState("");
  const [addOldBook, { isLoading, isError }] = useAddOldBookMutation();

  // Get the current logged-in user
  const { currentUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("author", data.author);
    formData.append("edition", data.edition);
    formData.append("description", data.description);
    formData.append("type", data.type);
    formData.append("image", image);
    formData.append("email", currentUser?.email);
    formData.append("contactNumber", data.contactNumber);
    formData.append("address", data.address);

    try {
      await addOldBook(formData).unwrap();
      toast.success("Your book listed successfully for sale!");
    } catch (error) {
      toast.error("Something went wrong! Please try again.");
      console.error(error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div
      className={`h-[calc(100vh-120px)] flex justify-center items-center ${
        darkMode ? "bg-gray-900" : "text-white"
      }`}
    >
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="w-full max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded px-4 sm:px-8 my-4 sm:my-8 border-2 border-gray-300 dark:border-white">
        <h2 className="text-xl font-semibold mb-4 text-black dark:text-white mt-2 text-center">
          Sell Your Book
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {/* Book Title */}
            <div className="mb-4">
              <label
                className="block text-gray-700 dark:text-gray-300"
                htmlFor="title"
              >
                Book Title:
              </label>
              <input
                {...register("title", { required: "Title is required" })}
                type="text"
                name="title"
                id="title"
                placeholder="Book Title"
                className="shadow appearance-none border-2 border-black dark:border-white rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow dark:bg-gray-700 dark:text-white text-black"
              />
              {errors.title && (
                <p className="text-red-500 text-xs italic">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Author */}
            <div className="mb-4">
              <label
                className="block text-gray-700 dark:text-gray-300"
                htmlFor="author"
              >
                Author:
              </label>
              <input
                {...register("author", { required: "Author is required" })}
                type="text"
                name="author"
                id="author"
                placeholder="Author Name"
                className="shadow appearance-none border-2 border-black dark:border-white rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow dark:bg-gray-700 dark:text-white text-black"
              />
              {errors.author && (
                <p className="text-red-500 text-xs italic">
                  {errors.author.message}
                </p>
              )}
            </div>

            {/* Edition */}
            <div className="mb-4">
              <label
                className="block text-gray-700 dark:text-gray-300"
                htmlFor="edition"
              >
                Book Edition:
              </label>
              <input
                {...register("edition", { required: "Edition is required" })}
                type="text"
                name="edition"
                id="edition"
                placeholder="Book Edition"
                className="shadow appearance-none border-2 border-black dark:border-white rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow dark:bg-gray-700 dark:text-white text-black"
              />
              {errors.edition && (
                <p className="text-red-500 text-xs italic">
                  {errors.edition.message}
                </p>
              )}
            </div>

            {/* Book Type */}
            <div className="mb-4">
              <label
                className="block text-gray-700 dark:text-gray-300"
                htmlFor="type"
              >
                Book Type:
              </label>
              <select
                {...register("type", { required: "Book type is required" })}
                className="shadow appearance-none border-2 border-black dark:border-white rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow dark:bg-gray-700 dark:text-white text-black"
                defaultValue="old"
              >
                <option value="old">Old</option>
              </select>
              {errors.type && (
                <p className="text-red-500 text-xs italic">
                  {errors.type.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="mb-4">
              <label
                className="block text-gray-700 dark:text-gray-300"
                htmlFor="email"
              >
                Email Address:
              </label>
              <input
                {...register("email", {
                  required: currentUser ? false : "Email is required",
                })}
                type="email"
                name="email"
                id="email"
                disabled
                defaultValue={currentUser ? currentUser.email : ""}
                className="shadow appearance-none border-2 border-black dark:border-white rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow dark:bg-gray-700 dark:text-white text-black"
              />
              {errors.email && (
                <p className="text-red-500 text-xs italic">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Contact Number */}
            <div className="mb-4">
              <label
                className="block text-gray-700 dark:text-gray-300"
                htmlFor="contactNumber"
              >
                Contact Number:
              </label>
              <input
                {...register("contactNumber", {
                  required: "Contact number is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Invalid phone number",
                  },
                })}
                type="number"
                name="contactNumber"
                id="contactNumber"
                placeholder="Contact Number"
                className="shadow appearance-none border-2 border-black dark:border-white rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow dark:bg-gray-700 dark:text-white text-black"
              />
              {errors.contactNumber && (
                <p className="text-red-500 text-xs italic">
                  {errors.contactNumber.message}
                </p>
              )}
            </div>

            {/* Address */}
            <div className="mb-4">
              <label
                className="block text-gray-700 dark:text-gray-300"
                htmlFor="address"
              >
                Address:
              </label>
              <input
                {...register("address", { required: "Address is required" })}
                name="address"
                id="address"
                placeholder="Enter Address"
                className="shadow appearance-none border-2 border-black dark:border-white rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow dark:bg-gray-700 dark:text-white text-black"
              />
              {errors.address && (
                <p className="text-red-500 text-xs italic">
                  {errors.address.message}
                </p>
              )}
            </div>

            {/* Image Upload */}
            <div className="mb-4">
              <label
                className="block text-gray-700 dark:text-gray-300"
                htmlFor="image"
              >
                Upload Book Photo:
              </label>
              <input
                type="file"
                accept="image/*"
                {...register("image", { required: "Book photo is required" })}
                onChange={handleFileChange}
                className="shadow appearance-none border-2 border-black dark:border-white rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow dark:bg-gray-700 dark:text-white"
              />
              {errors.image && (
                <p className="text-red-500 text-xs italic">
                  {errors.image.message}
                </p>
              )}
            </div>
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div className="mb-4 space-y-2 ">
              <p className="text-black dark:text-white">Image Preview :</p>
              <img
                src={imagePreview}
                alt="Book Preview"
                width="80"
                className="rounded"
              />
            </div>
          )}

          {/* Submit Button */}
          <div className="mb-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none border-2 border-black dark:border-white "
            >
              {isLoading ? "Listing..." : "Sell Book"}
            </button>
          </div>
        </form>

        {/* Note */}
        <div className="mt-4 text-center text-black dark:text-white font-bold">
          <p>Note: Old Book is sold at 40% of MRP of that Book</p>
          <p>Payment will be done in cash</p>
        </div>

        {/* Footer */}
        <p className="mt-5 text-center text-gray-500 text-xs dark:text-gray-400">
          ©2025 Book Store. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default SellBookPage;

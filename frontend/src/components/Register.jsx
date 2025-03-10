import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { sendEmailVerification } from "firebase/auth";

const Register = ({ darkMode }) => {
  const [message, setMessage] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const navigate = useNavigate();

  const { registerUser, loginUser, signInWithGoogle } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [passwordVisible, setPasswordVisible] = useState(false); // State for toggling password visibility

  const onSubmit = async (data) => {
    try {
      // Register the user
      const userCredential = await registerUser(data.email, data.password);
      const user = userCredential.user;

      // Send verification email
      await sendEmailVerification(user);

      // Show a success toast and instruct the user to verify their email
      toast.info("Verification email sent. Please check your inbox.", {
        position: "top-center",
      });

      // Redirect to login page
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      setMessage("Please provide a valid email and password.");
      console.error(error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      // Attempt Google sign-in
      await signInWithGoogle();

      // Display success message using SweetAlert2
      Swal.fire({
        title: "Registerd successful!",
        text: "You have successfully registered in with Google.",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        // Redirect the user to the homepage after closing the SweetAlert
        navigate("/");
      });
    } catch (error) {
      // Display error message using SweetAlert2
      Swal.fire({
        title: "Google Sign-Up Failed",
        text: "Google sign-up failed. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
      console.error(error);
    }
  };

  return (
    <div
      className={`h-[calc(100vh-120px)] flex justify-center items-center ${
        darkMode ? "bg-gray-900 text-white" : " text-white"
      }`}
    >
      <div className="w-full max-w-sm mx-auto bg-white dark:bg-gray-800 shadow-md rounded-md px-8 pt-6 pb-8 mb-4 border-2 border-gray-300 dark:border-white">
        <h2 className="text-xl font-semibold text-black mb-4 dark:text-white">
          Please Register
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Email Field */}
          <div className="mb-4">
            <label
              className="block text-gray-700 dark:text-gray-300"
              htmlFor="email"
            >
              Email
            </label>
            <input
              {...register("email", { required: "Email is required" })}
              type="email"
              name="email"
              id="email"
              placeholder="Email Address"
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow dark:bg-gray-700 dark:text-white"
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="mb-4 relative">
            <label
              className="block text-gray-700 dark:text-gray-300"
              htmlFor="password"
            >
              Password
            </label>
            <input
              {...register("password", { required: "Password is required" })}
              type={passwordVisible ? "text" : "password"} // Toggle between text and password
              name="password"
              id="password"
              placeholder="Password"
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow dark:bg-gray-700 text-black dark:text-white"
            />
            <button
              type="button"
              onClick={() => setPasswordVisible(!passwordVisible)} // Toggle password visibility
              className="absolute right-3 mt-4 transform -translate-y-1/2 text-gray-500"
            >
              {passwordVisible ? <FaEyeSlash /> : <FaEye />}{" "}
              {/* Toggle eye icon */}
            </button>
            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password.message}</p>
            )}
          </div>

          {/* Error Message */}
          {message && (
            <p className="text-red-500 text-xs italic mb-3">{message}</p>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded focus:outline-none"
            >
              Register
            </button>
          </div>
        </form>

        {/* Redirect to Login */}
        <p className="align-baseline font-medium mt-4 text-sm text-black dark:text-white">
          Have an account? Please{" "}
          <Link to="/login" className="text-blue-500 hover:text-blue-700">
            Login
          </Link>
        </p>

        {/* google sign in */}
        <div className="mt-4">
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex flex-wrap gap-1 items-center justify-center bg-secondary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none"
          >
            <FaGoogle className="mr-2" />
            Sign Up with Google
          </button>
        </div>

        {/* Footer */}
        <p className="mt-5 text-center text-gray-500 text-xs dark:text-gray-400">
          ©2025 Book Store. All rights reserved.
        </p>
      </div>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default Register;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2"; // Import SweetAlert2

const Login = ({ darkMode }) => {
  const [message, setMessage] = useState("");
  const { loginUser, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [passwordVisible, setPasswordVisible] = useState(false); // State for toggling password visibility

  const onSubmit = async (data) => {
    try {
      await loginUser(data.email, data.password);
      // Using SweetAlert2 after successful login
      Swal.fire({
        title: "Login successful!",
        text: "You have successfully logged in.",
        icon: "success",
        confirmButtonText: "OK",
      });
      navigate("/");
    } catch (error) {
      setMessage("Please provide a valid email and password");
      // Using SweetAlert2 for error handling
      Swal.fire({
        title: "Error",
        text: "Invalid email or password. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
      console.error(error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      // Using SweetAlert2 after Google login
      Swal.fire({
        title: "Login successful!",
        text: "You have successfully logged in with Google.",
        icon: "success",
        confirmButtonText: "OK",
      });
      navigate("/");
    } catch (error) {
      // Using SweetAlert2 for error handling
      Swal.fire({
        title: "Google Sign-In Failed",
        text: "Google sign-in failed. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
      console.error(error);
    }
  };

  return (
    <div
      className={`h-[calc(100vh-120px)] flex justify-center items-center ${
        darkMode ? "bg-gray-900 text-white" : "text-black"
      }`}
    >
      <div className="w-full max-w-sm mx-auto bg-white dark:bg-gray-800 shadow-md rounded-md px-8 pt-6 pb-8 mb-4 border-2 border-gray-300 dark:border-white">
        <h2 className="text-xl font-semibold mb-4 dark:text-white">
          Please Login
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label
              className="block text-gray-700 dark:text-gray-300"
              htmlFor="email"
            >
              Email
            </label>
            <input
              {...register("email", { required: true })}
              type="email"
              name="email"
              id="email"
              placeholder="Email Address"
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="mb-4 relative">
            <label
              className="block text-gray-700 dark:text-gray-300"
              htmlFor="password"
            >
              Password
            </label>
            <input
              {...register("password", { required: true })}
              type={passwordVisible ? "text" : "password"} // Toggle between text and password
              name="password"
              id="password"
              placeholder="Password"
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow dark:bg-gray-700 dark:text-white"
            />
            <button
              type="button"
              onClick={() => setPasswordVisible(!passwordVisible)} // Toggle password visibility
              className="absolute right-3 mt-4  transform -translate-y-1/2 text-gray-500"
            >
              {passwordVisible ? <FaEyeSlash /> : <FaEye />}{" "}
              {/* Toggle eye icon */}
            </button>
          </div>
          {message && (
            <p className="text-red-500 text-xs italic mb-3">{message}</p>
          )}
          <div>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded focus:outline-none">
              Login
            </button>
          </div>
        </form>
        <p className="align-baseline font-medium mt-4 text-sm dark:text-white">
          Haven't an account? Please{" "}
          <Link to="/register" className="text-blue-500 hover:text-blue-700">
            Register
          </Link>
        </p>

        {/* google sign in */}
        <div className="mt-4">
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex flex-wrap gap-1 items-center justify-center bg-secondary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none"
          >
            <FaGoogle className="mr-2" />
            Sign in with Google
          </button>
        </div>

        <p className="mt-5 text-center text-gray-500 text-xs dark:text-gray-400">
          ©2025 Book Store. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;

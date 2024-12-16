import { Link } from "react-router-dom";
import { HiMiniBars3CenterLeft, HiOutlineShoppingCart } from "react-icons/hi2";
import { IoSearchOutline } from "react-icons/io5";
import { HiOutlineUser, HiOutlineSun, HiOutlineMoon } from "react-icons/hi";

import avatarImg from "../assets/avatar.png";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";

const navigation = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Orders", href: "/orders" },
  { name: "Cart Page", href: "/cart" },
  { name: "Check Out", href: "/checkout" },
];

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const cartItems = useSelector((state) => state.cart.cartItems);

  const { currentUser, logout } = useAuth();

  const handleLogOut = () => {
    logout();
  };

  return (
    <header
      className={`max-w-screen-2xl mx-auto px-4 py-6 ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <nav className="flex justify-between items-center">
        {/* Left side */}
        <div className="flex items-center md:gap-16 gap-4">
          <Link to="/">
            <HiMiniBars3CenterLeft className="size-6" />
          </Link>

          {/* Search input */}
          <div className="relative sm:w-72 w-40 space-x-2">
            <IoSearchOutline
              className={`absolute inline-block left-3 inset-y-2 ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            />

            <input
              type="text"
              placeholder="Search here"
              className={`${
                darkMode
                  ? "bg-gray-800 text-white"
                  : "bg-[#EAEAEA] text-gray-900"
              } w-full py-1 md:px-8 px-6 rounded-md focus:outline-none`}
            />
          </div>
        </div>

        {/* Right side */}
        <div className="relative flex items-center md:space-x-3 space-x-2">
          {/* Theme toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-md bg-gray-200 dark:bg-gray-500"
          >
            {darkMode ? (
              <HiOutlineSun className="text-yellow-400 size-6" />
            ) : (
              <HiOutlineMoon className="text-gray-600 size-6" />
            )}
          </button>

          {/* User actions */}
          <div className="relative">
            {currentUser ? (
              <>
                <button
                  className="btn btn-outline-primary p-0"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <img
                    src={avatarImg}
                    alt="User Avatar"
                    className={`size-7 rounded-full ${
                      currentUser ? "ring-2 ring-blue-500" : ""
                    }`}
                  />
                </button>

                {/* User dropdown */}
                {isDropdownOpen && (
                  <div
                    className={`absolute right-0 mt-2 w-48 shadow-lg rounded-md z-40 ${
                      darkMode ? "bg-gray-800 text-white" : "bg-white"
                    }`}
                  >
                    <ul className="py-2">
                      {navigation.map((item) => (
                        <li
                          key={item.name}
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <Link
                            to={item.href}
                            className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            {item.name}
                          </Link>
                        </li>
                      ))}
                      <li>
                        <button
                          onClick={handleLogOut}
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <Link to="/login">
                <HiOutlineUser className="size-6" />
              </Link>
            )}
          </div>
          <Link
            to="/cart"
            className={`bg-primary p-1 sm:px-6 px-2 flex items-center rounded-sm ${
              darkMode ? "text-white" : "text-black"
            }`}
          >
            <HiOutlineShoppingCart />
            {cartItems.length > 0 ? (
              <span className="text-sm font-semibold sm:ml-1">
                {cartItems.length}
              </span>
            ) : (
              <span className="text-sm font-semibold sm:ml-1">0</span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

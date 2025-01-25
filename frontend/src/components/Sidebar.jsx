import { Link } from "react-router-dom";
import { HiOutlineShoppingCart, HiOutlineUser } from "react-icons/hi";
import { HiOutlineSun, HiOutlineMoon } from "react-icons/hi";
import { useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";
import avatarImg from "../assets/avatar.png";
import { useState, useEffect } from "react";
import { TfiEmail } from "react-icons/tfi";
import { BsFillTelephoneFill } from "react-icons/bs";

const navigation = [
  { name: "Orders", href: "/orders" },
  { name: "Cart Page", href: "/cart" },
  { name: "Check Out", href: "/checkout" },
];

const Sidebar = ({ isOpen, setIsOpen, darkMode, toggleDarkMode }) => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const { currentUser, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div
      className={`fixed top-0 right-0 w-64 h-full bg-white dark:bg-black text-black dark:text-white z-50 p-4 transform transition-transform flex flex-col justify-between ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <button
        onClick={() => setIsOpen(false)}
        className="absolute top-4 right-4 text-black dark:text-white"
      >
        Close
      </button>

      <div className="flex flex-col item-center justify-between">
        <ul className="space-y-4 mt-10">
          <li>
            <Link
              to="/sell"
              className="p-2 rounded-md border-2 border-black flex items-center hover:bg-gray-200 dark:text-white"
            >
              Sell
            </Link>
          </li>

          <li>
            <Link
              to="/cart"
              className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-200 border-2 border-black"
            >
              <HiOutlineShoppingCart className="w-6 h-6 dark:text-white rounded-md border-2 border-black" />
              Cart ({cartItems.length > 0 ? cartItems.length : "0"})
            </Link>
          </li>

          <li>
            <button
              onClick={toggleDarkMode}
              className="flex items-center gap-2 p-2 hover:bg-gray-200 rounded-md border-2 border-black"
            >
              {darkMode ? (
                <HiOutlineSun className="w-6 h-6" />
              ) : (
                <HiOutlineMoon className="w-6 h-6 dark:text-white" />
              )}
              Theme
            </button>
          </li>

          {currentUser ? (
            <li>
              <button
                className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-200 border-2 border-black dark:border-white"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <img
                  src={avatarImg}
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full"
                />
                <span>Profile</span>
              </button>

              {isDropdownOpen && (
                <div className="mt-2 space-y-2">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="block p-2 text-sm rounded-md hover:bg-gray-200 border-2 border-black dark:border-white"
                    >
                      {item.name}
                    </Link>
                  ))}
                  <button
                    onClick={logout}
                    className="block w-full p-2 text-sm text-left rounded-md hover:bg-gray-200 dark:text-white border-2 border-black dark:border-white"
                  >
                    Logout
                  </button>
                </div>
              )}
            </li>
          ) : (
            <li>
              <Link
                to="/login"
                className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-200 border-2 border-black"
              >
                <HiOutlineUser className="w-6 h-6 dark:text-white" />
                Login
              </Link>
            </li>
          )}
        </ul>
      </div>

      <div className="mt-auto pt-4 border-t-2 border-black dark:border-white">
        <div className="text-sm text-gray-600 flex flex-col gap-2">
          <div className="flex items-center space-x-1">
            <TfiEmail className="w-5 h-5" />
            <span className="dark:text-white">: thebookhub@gmail.com</span>
          </div>
          <div className="flex items-center space-x-1">
            <BsFillTelephoneFill className="w-5 h-5" />
            <span className="dark:text-white">: 01-32234232, 9845225675</span>
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-white">
            &copy; 2025. The Book Hub. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

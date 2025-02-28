import { Link } from "react-router-dom";
import { HiMiniBars3CenterLeft, HiOutlineShoppingCart } from "react-icons/hi2";
import { IoSearchOutline } from "react-icons/io5";
import { HiOutlineUser, HiOutlineSun, HiOutlineMoon } from "react-icons/hi";
import avatarImg from "../assets/avatar.png";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";
import Sidebar from "./sidebar";
import { useSearchBookByTitleQuery } from "../redux/features/books/booksApi";
import Swal from "sweetalert2"; // Import SweetAlert2

const navigation = [
  { name: "View Orders", href: "/orders" },
  { name: "Cart Page", href: "/cart" },
  { name: "Check Out", href: "/checkout" },
  { name: "View Sold Books", href: "/sold-old-books" },
  { name: "History", href: "/history" },
];

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const cartItems = useSelector((state) => state.cart.cartItems);
  const { currentUser, logout } = useAuth();

  // Reset dropdown state when user logs in
  useEffect(() => {
    if (currentUser) {
      setIsDropdownOpen(false); // Ensure dropdown is closed after login
    }
  }, [currentUser]);

  const handleLogOut = () => {
    logout();
    // Show SweetAlert2 on logout
    Swal.fire({
      title: "Logged Out",
      text: "You have successfully logged out.",
      icon: "success",
      confirmButtonText: "OK",
    });
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const {
    data: searchResults,
    isLoading,
    isError,
    error,
  } = useSearchBookByTitleQuery(searchQuery, {
    skip: !searchQuery,
  });

  useEffect(() => {
    setIsSearching(isLoading);
  }, [isLoading]);

  return (
    <header
      className={`mx-auto px-4 py-4 border-b-2 border-black shadow-md dark:border-white ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <nav className="flex justify-between items-center sm:px-14 px-4">
        {/* Left side */}
        <div className="flex items-center gap-4 sm:gap-8">
          <Link to="/">
            <img src="/fav-icon.png" alt="favicon" />
          </Link>

          {/* Search input */}
          <div className="relative w-40 sm:w-72">
            <IoSearchOutline
              className={`absolute left-3 inset-y-2 ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            />
            <input
              type="text"
              placeholder="Search here"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} // Update searchQuery state
              className={`w-full py-1 px-6 sm:px-8 rounded-md focus:outline-none ${
                darkMode
                  ? "bg-gray-800 text-white"
                  : "bg-[#EAEAEA] text-gray-900"
              }`}
            />

            {/* Show search results if there are any */}
            {searchQuery &&
            !isSearching &&
            searchResults &&
            searchResults.length > 0 ? (
              <div
                className={`absolute top-full left-0 w-full mt-2 p-2 shadow-md rounded-md ${
                  darkMode ? "text-white bg-gray-800" : "bg-white"
                }`}
              >
                <ul>
                  {searchResults.map((book) => (
                    <li
                      key={book._id}
                      className="p-2 hover:bg-indigo-100 dark:hover:bg-gray-800 cursor-pointer transition-all"
                    >
                      <Link
                        to={`/book/${book._id}`}
                        className={`text-sm ${
                          darkMode ? "text-white" : "text-gray-700"
                        }`}
                        onClick={() => {
                          setSearchQuery(""); // Clear the search query
                          setIsDropdownOpen(false); // Close the dropdown if it's open
                        }}
                      >
                        {book.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : searchQuery && !isSearching && searchResults?.length === 0 ? (
              <div
                className={`absolute top-full left-0 w-full mt-2 p-2 shadow-md rounded-md ${
                  darkMode ? "text-white bg-gray-800" : "bg-white"
                }`}
              >
                <p className="p-2 text-sm text-gray-500">Book not found</p>
              </div>
            ) : null}
          </div>
        </div>
        {/* Right side */}
        <div className="hidden md:flex items-center gap-4 sm:gap-6 relative">
          {/* Sell Link */}
          <Link
            to="/sell"
            className="p-1 sm:px-6 px-4 flex items-center border-2 border-black dark:border-white rounded-md shadow-md"
          >
            Sell
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            className={`p-1 sm:px-6 px-4 flex items-center rounded-md border-2 border-black shadow-md ${
              darkMode ? "text-white dark:border-white" : "text-black"
            }`}
          >
            <HiOutlineShoppingCart />
            <span className="text-sm font-semibold ml-1">
              {cartItems.length > 0 ? cartItems.length : "0"}
            </span>
          </Link>

          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-md dark:text-white"
          >
            {darkMode ? (
              <HiOutlineSun className="w-6 h-6" />
            ) : (
              <HiOutlineMoon className="w-6 h-6 text-gray-600" />
            )}
          </button>

          {/* User Actions */}
          <div className="relative">
            {currentUser ? (
              <>
                <button
                  className="p-0"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <img
                    src={avatarImg}
                    alt="User Avatar"
                    className={`w-6 h-6 sm:w-6 sm:h-6 rounded-full ${
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
                <HiOutlineUser className="w-6 h-6" />
              </Link>
            )}
          </div>
        </div>

        {/* Sidebar button for medium devices and below */}
        <button className="md:hidden p-2" onClick={toggleSidebar}>
          <HiMiniBars3CenterLeft className="w-6 h-6" />
        </button>

        {/* Sidebar for medium devices */}
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      </nav>
    </header>
  );
};

export default Navbar;

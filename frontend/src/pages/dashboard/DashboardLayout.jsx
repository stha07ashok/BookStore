import React, { useState, useEffect, useRef } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { HiViewGridAdd } from "react-icons/hi";
import { MdOutlineManageHistory } from "react-icons/md";
import { RxDashboard } from "react-icons/rx";
import { FaBorderAll } from "react-icons/fa6";
import { PiBookOpenTextBold } from "react-icons/pi";
import { useSearchBookByTitleQuery } from "../../redux/features/books/booksApi";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null); // Ref for the dropdown

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // Book search results
  const {
    data: searchResults,
    isLoading,
    isError,
  } = useSearchBookByTitleQuery(searchQuery, {
    skip: !searchQuery, // Skip the query if there's no search query
  });

  const handleSearchResultClick = (bookId) => {
    navigate(`/dashboard/edit-book/${bookId}`);
    setSearchQuery(""); // Clear the search query
    setIsDropdownOpen(false); // Close dropdown after book click
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Dynamic class styling for active and inactive links
  const getNavLinkClass = ({ isActive }) =>
    isActive
      ? "inline-flex items-center justify-center py-3 px-3 text-purple-600 bg-white shadow-md rounded-lg transition-all"
      : "inline-flex items-center justify-center py-3 px-3 text-gray-500 hover:text-gray-400 hover:bg-gray-700 rounded-lg transition-all";

  return (
    <section className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="flex flex-col w-full md:w-28 bg-gray-800 text-gray-500 md:flex-shrink-0">
        {/* Logo */}
        <div className="flex items-center justify-center h-16 bg-purple-600">
          <img src="/fav-icon.png" alt="Logo" className="h-8 w-8" />
        </div>

        {/* Navigation */}
        <nav className="flex flex-row md:flex-col justify-around md:justify-start items-center md:items-stretch md:space-y-6 p-4 md:p-0 md:mt-6">
          <div className="flex flex-col items-center">
            <NavLink to="/dashboard" className={getNavLinkClass}>
              <RxDashboard className="h-6 w-6" />
            </NavLink>
            <span>Dashboard</span>
          </div>

          <div className="flex flex-col items-center">
            <NavLink to="/dashboard/add-new-book" className={getNavLinkClass}>
              <HiViewGridAdd className="h-6 w-6" />
            </NavLink>
            <span>Add Book</span>
          </div>

          <div className="flex flex-col items-center">
            <NavLink to="/dashboard/manage-books" className={getNavLinkClass}>
              <MdOutlineManageHistory className="h-6 w-6" />
            </NavLink>
            <span>Manage Book</span>
          </div>

          <div className="flex flex-col items-center">
            <NavLink to="/dashboard/getallorders" className={getNavLinkClass}>
              <FaBorderAll className="h-6 w-6" />
            </NavLink>
            <span>All Orders</span>
          </div>

          <div className="flex flex-col items-center">
            <NavLink to="/dashboard/soldoldbooks" className={getNavLinkClass}>
              <PiBookOpenTextBold className="h-6 w-6" />
            </NavLink>
            <span className="text-balance px-4">Get Sold Old Books</span>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-grow flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between h-16 px-4 bg-white shadow-md">
          <div className="flex items-center w-full max-w-md relative">
            <input
              type="text"
              placeholder="Search for a book to edit..."
              className="w-full p-2 border-2 rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {/* Dropdown with Search Results */}
            {searchQuery && (
              <div
                ref={dropdownRef}
                className="absolute w-full bg-white shadow-lg rounded-lg mt-24 max-h-60  z-10"
                style={{ marginTop: "100px" }} // Adjust margin to create space below the search box
              >
                {isLoading ? (
                  <p className="p-2 text-gray-500">Loading...</p>
                ) : isError ? (
                  <p className="p-2 ">No books found</p>
                ) : searchResults && searchResults.length > 0 ? (
                  <ul>
                    {searchResults.map((book) => (
                      <li
                        key={book._id}
                        onClick={() => handleSearchResultClick(book._id)}
                        className="p-2 hover:bg-indigo-100 cursor-pointer transition-all"
                      >
                        <span className="text-sm text-gray-700">
                          {book.title}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="p-2 text-gray-500">No books found</p>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {/* User Info */}
            <div className="hidden md:flex flex-col items-end leading-tight">
              <span className="font-semibold text-gray-800">Grace Simmons</span>
              <span className="text-sm text-gray-600">Admin</span>
            </div>

            <img
              src="https://randomuser.me/api/portraits/women/68.jpg"
              alt="User"
              className="h-10 w-10 rounded-full"
            />
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="hidden md:inline-flex items-center justify-center px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Main Outlet */}
        <main className="flex-grow p-4 bg-gray-50">
          {/* Render other content */}
          <Outlet />
        </main>
      </div>
    </section>
  );
};

export default DashboardLayout;

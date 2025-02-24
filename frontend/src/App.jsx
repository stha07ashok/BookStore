import { Outlet } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { AuthProvide } from "./context/AuthContext";
import { useEffect, useState } from "react";

function App() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true" // Load dark mode preference from localStorage
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    localStorage.setItem("darkMode", darkMode); // Save dark mode setting to localStorage
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <>
      <AuthProvide>
        <div
          className={
            darkMode ? "dark bg-gray-900 text-white" : "bg-white text-gray-900"
          }
        >
          <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          <main className="min-h-screen max-w-screen-2xl mx-auto px-4 py-6 font-primary">
            <Outlet />
          </main>
          <Footer />
        </div>
      </AuthProvide>
    </>
  );
}

export default App;

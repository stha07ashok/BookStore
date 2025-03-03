import React from "react";
import footerLogo from "../assets/footer-logo.png";

import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom";
import { TfiEmail } from "react-icons/tfi";
import { BsFillTelephoneFill } from "react-icons/bs";

const Footer = () => {
  return (
    <footer className=" text-black py-10 px-4 border-t-2 border-black shadow-md dark:border-white">
      {/* Top Section */}
      <div className="container mx-auto flex flex-col md:flex-row justify-between  gap-8">
        {/* Left Side - Logo and Nav */}

        <div className="md:w-1/2 w-full flex flex-col md:flex-row items-center gap-3  ">
          <img src={footerLogo} alt="Logo" className="mb-5 w-36" />

          <div>
            <p className="text-3xl font-bold text-justify dark:text-white">
              Welcome to the Book Hub System – Your Gateway to Easy Buying and
              Selling of Books!
            </p>
            <p className="text-justify dark:text-white">
              Discover a seamless platform designed for book lovers to buy and
              sell new books with ease. Whether you're looking to expand your
              personal library or share your latest finds, our user-friendly
              interface ensures a smooth experience.
            </p>
          </div>
        </div>

        {/* center - Newsletter */}
        <div className="flex flex-col gap-2 ">
          <p className="text-3xl font-bold dark:text-white">Quick Links</p>
          <Link to="/" className="dark:text-white">
            Home
          </Link>
          <Link to="/cart" className="dark:text-white">
            Cart page
          </Link>
          <Link to="/orders" className="dark:text-white">
            Orders
          </Link>
        </div>

        {/* right side */}
        <div className="flex flex-col gap-2">
          <p className="text-3xl font-bold dark:text-white">Contact Us</p>
          <div className="flex items-center space-x-1 dark:text-white">
            <TfiEmail />
            <span>: thebookhub@gmail.com</span>
          </div>
          <div className="flex items-center space-x-1 dark:text-white">
            <BsFillTelephoneFill />
            <span>: 01-32234232, 9845225675</span>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center mt-10 border-t border-gray-700 pt-6 dark:border-white">
        {/* Left Side - Privacy Links */}
        <ul className="flex gap-6 mb-4 md:mb-0">
          <li>
            <a href="#privacy" className="hover:text-primary dark:text-white">
              Privacy Policy
            </a>
          </li>
          <li>
            <a href="#terms" className="hover:text-primary dark:text-white">
              Terms of Service
            </a>
          </li>
        </ul>

        {/* Right Side - Social Icons */}
        <div className="flex gap-6 dark:text-white">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary"
          >
            <FaFacebook size={24} />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary"
          >
            <FaTwitter size={24} />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary"
          >
            <FaInstagram size={24} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

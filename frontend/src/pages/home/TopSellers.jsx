import React, { useEffect, useState } from "react";
import BookCard from "../books/BookCard";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// import required modules
import { Pagination, Navigation } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { useFetchAllBooksQuery } from "../../redux/features/books/booksApi";

const category = [
  "Choose a genre",
  "Business",
  "Fiction",
  "Horror",
  "Advanture",
  "Engineering",
  "Medical",
  "Science",
  "Management",
  "Arts",
];

const TopSellers = () => {
  const [selectedCategory, setSelectedCategory] = useState("Choose a genre");

  const { data: books = [] } = useFetchAllBooksQuery(); //fetching books data from backend

  const filteredBooks =
    selectedCategory === "Choose a genre"
      ? books
      : books.filter(
          (book) => book.category === selectedCategory.toLowerCase()
        );

  return (
    <div className="py-10">
      <h2 className="text-3xl font-semibold mb-6">Top Sellers</h2>
      {/*category filtering */}
      <div className="mb-8 flex items-center">
        <select
          onChange={(e) => setSelectedCategory(e.target.value)}
          name="category"
          id="category"
          className="border-2 border-black  border-gray-250 rounded-md px-4 py-2 focus:outline-none dark:text-white dark:border-white dark:bg-gray-800"
        >
          {category.map((category, index) => (
            <option key={index} value={category} className="dark:text-white">
              {category}
            </option>
          ))}
        </select>
      </div>
      <Swiper
        slidesPerView={3} // Default for larger screens
        spaceBetween={30}
        navigation={true}
        breakpoints={{
          640: {
            slidesPerView: 2, // Show only 2 books on mobile devices
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2, // Show 2 books on tablets
            spaceBetween: 40,
          },
          1024: {
            slidesPerView: 3, // Show 3 books on larger screens
            spaceBetween: 50,
          },
          1180: {
            slidesPerView: 3, // Show 3 books on very large screens
            spaceBetween: 50,
          },
        }}
        modules={[Pagination, Navigation]}
        className="mySwiper"
      >
        {filteredBooks.slice(0, 2).length > 0 &&
          filteredBooks.map((book, index) => (
            <SwiperSlide key={index}>
              <BookCard book={book} />
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  );
};

export default TopSellers;

const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const Book = require("../soldOldBooks/old.book.model");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const sellBook = async (req, res) => {
  try {
    // Check if file is uploaded
    if (!req.file) {
      return res.status(400).json({ message: "Book photo is required" });
    }

    const { title, author, edition, type } = req.body;

    // Validate required fields
    if (!title || !author || !edition || !type) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Upload image to Cloudinary
    const filePath = req.file.path;
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      folder: "bookstore/images",
    });

    // Get the image URL from the Cloudinary upload result
    const imageUrl = uploadResult.secure_url;

    // Clean up local temp file after Cloudinary upload
    fs.unlinkSync(filePath);

    // Create a new book record
    const newBook = new Book({
      title,
      author,
      edition,
      type,
      image: imageUrl, // Use Cloudinary URL
    });

    // Save the book to the database
    await newBook.save();

    // Return success response
    res.status(201).json({
      message: "Book listed successfully!",
      data: newBook,
    });
  } catch (error) {
    console.error("Error saving book:", error);
    res
      .status(500)
      .json({ message: "Something went wrong! Please try again." });
  }
};

const getAllSoldBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json({
      message: "Books retrieved successfully!",
      data: books,
    });
  } catch (error) {
    console.error("Error retrieving books:", error);
    res
      .status(500)
      .json({ message: "Something went wrong! Please try again." });
  }
};

const deleteABook = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBook = await Book.findByIdAndDelete(id);
    if (!deletedBook) {
      return res.status(404).json({ message: "Sold Old Book not found!" });
    }
    res.status(200).json({
      message: "Sold Old Book deleted successfully",
      book: deletedBook,
    });
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ message: "Failed to delete sold old book" });
  }
};

module.exports = { sellBook, getAllSoldBooks, deleteABook };

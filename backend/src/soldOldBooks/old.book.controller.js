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

    // Destructure the incoming request body
    const { title, author, edition, type, address, contactNumber, email } =
      req.body;

    // Validate required fields
    if (
      !title ||
      !author ||
      !edition ||
      !type ||
      !address ||
      !contactNumber ||
      !email
    ) {
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
      address,
      contactNumber,
      email,
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

const getSoldBooksByEmail = async (req, res) => {
  try {
    const { email } = req.params; // Get the email from URL params

    // Ensure the database query resolves and assigns the result to soldBooks
    const soldBooks = await Book.find({
      email: email,
      isDeleted: false,
    });

    // Check if no books were found
    if (!soldBooks || soldBooks.length === 0) {
      return res.status(404).json({ message: "No books found for this email" });
    }

    // Respond with the found books
    res.status(200).json(soldBooks);
  } catch (error) {
    // Log and send error response
    console.error("Error fetching books by email:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllSoldBooksByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ message: "Email parameter is missing" });
    }

    const soldBooks = await Book.find({ email }).sort({
      createdAt: -1,
    });

    if (!soldBooks || soldBooks.length === 0) {
      return res.status(404).json({ message: "No books found" });
    }

    res.status(200).json(soldBooks);
  } catch (error) {
    console.error("Error fetching books", error);
    res.status(500).json({ message: "Failed to fetch books" });
  }
};

const getAllSoldBooks = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      const books = await Book.find();
      return res.status(200).json({
        message: "Books retrieved successfully!",
        data: books,
      });
    }

    const books = await Book.find({ email: email });
    if (books.length === 0) {
      return res.status(404).json({
        message: "No books found for this email address.",
      });
    }

    return res.status(200).json({
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

    const updatedBook = await Book.findByIdAndUpdate(
      id,
      { isDeleted: true, status: "Book is deleted!!" },
      { new: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ message: "Sold Old Book not found!" });
    }

    res.status(200).json({
      message: "Sold Old Book deleted successfully",
      book: updatedBook,
    });
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ message: "Failed to delete sold old book" });
  }
};

const updateBookStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate the status field
    if (!["Pending", "Sold", "Rejected", "Processing"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updatedBook = await Book.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json(updatedBook);
  } catch (error) {
    console.error("Error updating book status", error);
    res.status(500).json({ message: "Failed to update book status" });
  }
};

module.exports = {
  sellBook,
  deleteABook,
  updateBookStatus,
  getAllSoldBooks,
  getSoldBooksByEmail,
  getAllSoldBooksByEmail,
};

const Book = require("./book.model.js");

const postABook = async (req, res) => {
  try {
    const newBook = await Book({ ...req.body });
    await newBook.save();
    res
      .status(200)
      .send({ message: "Book posted successfully", book: newBook });
  } catch (error) {
    console.error("Error creating book", error);
    res.status(500).send({ message: "Failed to create book" });
  }
};

// get all books
const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.status(200).send(books);
  } catch (error) {
    console.error("Error fetching books", error);
    res.status(500).send({ message: "Failed to fetch books" });
  }
};

const getSingleBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);
    if (!book) {
      res.status(404).send({ message: "Book not Found!" });
    }
    res.status(200).send(book);
  } catch (error) {
    console.error("Error fetching book", error);
    res.status(500).send({ message: "Failed to fetch book" });
  }
};

// update book data
const UpdateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBook = await Book.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedBook) {
      res.status(404).send({ message: "Book is not Found!" });
    }
    res.status(200).send({
      message: "Book updated successfully",
      book: updatedBook,
    });
  } catch (error) {
    console.error("Error updating a book", error);
    res.status(500).send({ message: "Failed to update a book" });
  }
};

const deleteABook = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBook = await Book.findByIdAndDelete(id);
    if (!deletedBook) {
      res.status(404).send({ message: "Book is not Found!" });
    }
    res.status(200).send({
      message: "Book deleted successfully",
      book: deletedBook,
    });
  } catch (error) {
    console.error("Error deleting a book", error);
    res.status(500).send({ message: "Failed to delete a book" });
  }
};

const updateBookItemsNumber = async (req, res) => {
  try {
    const { id } = req.params;
    const { itemsNumber } = req.body;
    // Validate itemsNumber: Ensure it's a valid number
    if (typeof itemsNumber !== "number" || isNaN(itemsNumber)) {
      return res.status(400).send({ message: "Invalid 'itemsNumber' value!" });
    }
    // Fetch the book from the database
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).send({ message: "Book not found!" });
    }
    // Check if there are enough items in stock
    if (itemsNumber < 0) {
      return res.status(400).send({ message: "Invalid stock number!" });
    }
    // Update the itemsnumber field
    book.itemsnumber = itemsNumber;
    await book.save();
    res.status(200).send({
      message: "Book items number updated successfully",
      book,
    });
  } catch (error) {
    console.error("Error updating book items number", error);
    res.status(500).send({
      message: "Failed to update book items number",
      error: error.message,
    });
  }
};

const searchBookByTitle = async (req, res) => {
  try {
    const { title } = req.query;

    // If title is not provided, send a bad request response
    if (!title) {
      return res
        .status(400)
        .send({ message: "Title query parameter is required!" });
    }

    // Search for books by title (case-insensitive search)
    const books = await Book.find({
      title: { $regex: title, $options: "i" }, // Use regular expression for case-insensitive search
    });

    if (books.length === 0) {
      return res
        .status(404)
        .send({ message: "No books found with that title!" });
    }

    res.status(200).send(books);
  } catch (error) {
    console.error("Error searching for books by title", error);
    res.status(500).send({ message: "Failed to search for books" });
  }
};

module.exports = {
  postABook,
  getAllBooks,
  getSingleBook,
  UpdateBook,
  deleteABook,
  updateBookItemsNumber,
  searchBookByTitle,
};

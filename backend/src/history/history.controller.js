const Order = require("../orders/order.model");
const soldOldBooks = require("../soldOldBooks/old.book.model");
const History = require("./history.model");

const createOrderHistory = async (orderId) => {
  try {
    // Find the order by its ID and populate productIds with the related book details
    const order = await Order.findById(orderId).populate("productIds");

    if (!order) {
      throw new Error("Order not found");
    }

    // Create a history entry with relevant order details
    const historyEntry = new History({
      itemType: "Order",
      actionDetails: {
        orderId: order._id,
        name: order.name,
        email: order.email,
        address: order.address,
        phone: order.phone,
        productIds: order.productIds.map((product) => product._id), // Assuming productIds is an array of books
        totalPrice: order.totalPrice,
        status: order.status,
      },
    });

    // Save the history entry
    await historyEntry.save();
    console.log("Order history entry created successfully.");
  } catch (error) {
    console.error("Error creating order history:", error);
  }
};

// Function to create history entry for an old book sale
const createOldBookHistory = async (oldBookId) => {
  try {
    // Find the old book by its ID
    const oldBook = await soldOldBooks.findById(oldBookId);

    if (!oldBook) {
      throw new Error("Old book not found");
    }

    // Create a history entry with relevant sold book details
    const historyEntry = new History({
      itemType: "OldBook",
      actionDetails: {
        oldBookId: oldBook._id,
        title: oldBook.title,
        author: oldBook.author,
        edition: oldBook.edition,
        type: oldBook.type,
        image: oldBook.image,
        status: oldBook.status,
        email: oldBook.email,
        contactNumber: oldBook.contactNumber,
        address: oldBook.address,
      },
    });

    await historyEntry.save();
    console.log("Old book history entry created successfully.");
  } catch (error) {
    console.error("Error creating old book history:", error);
  }
};

const getHistory = async (req, res) => {
  try {
    const history = await History.find().sort({ actionDate: -1 });
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: "Error fetching history", error });
  }
};

const deleteHistory = async (req, res) => {
  const { historyId } = req.params;

  try {
    const deletedHistory = await History.findByIdAndDelete(historyId);
    if (!deletedHistory) {
      return res.status(404).json({ message: "History record not found" });
    }
    res
      .status(200)
      .json({ message: "History record deleted successfully", deletedHistory });
  } catch (error) {
    res.status(500).json({ message: "Error deleting history record", error });
  }
};

const clearAllHistory = async (req, res) => {
  try {
    const result = await History.deleteMany({});
    res.status(200).json({ message: "All history records deleted", result });
  } catch (error) {
    res.status(500).json({ message: "Error clearing all history", error });
  }
};

module.exports = {
  createOrderHistory,
  createOldBookHistory,
  getHistory,
  deleteHistory,
  clearAllHistory,
};

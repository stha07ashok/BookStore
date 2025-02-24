import { createSlice } from "@reduxjs/toolkit";
import Swal from "sweetalert2";

// Load cart from localStorage if available
const loadCartFromStorage = () => {
  const storedCart = localStorage.getItem("cartItems");
  return storedCart ? JSON.parse(storedCart) : [];
};

const initialState = {
  cartItems: loadCartFromStorage(), // Initialize cart from localStorage
};

const cartSlice = createSlice({
  name: "cart",
  initialState: initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.cartItems.find(
        (item) => item._id === action.payload._id
      );

      if (!existingItem) {
        state.cartItems.push(action.payload);
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Product added to the cart",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        Swal.fire({
          position: "top-end",
          icon: "info",
          title: "Product already in the cart",
          showConfirmButton: false,
          timer: 1500,
        });
      }

      localStorage.setItem("cartItems", JSON.stringify(state.cartItems)); // Update localStorage
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (item) => item._id !== action.payload._id
      );

      localStorage.setItem("cartItems", JSON.stringify(state.cartItems)); // Update localStorage
    },
    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem("cartItems"); // Clear localStorage
    },
  },
});

// Export the actions
export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

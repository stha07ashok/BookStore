import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../redux/featers/carts/cartSlice.js";
import booksApi from "./featers/books/booksApi.js";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    [booksApi.reducerPath]: booksApi.reducer,
    // [ordersApi.reducerPath]: ordersApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(booksApi.middleware), //, ordersApi.middleware
});

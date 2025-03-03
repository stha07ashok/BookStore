import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../redux/features/carts/cartSlice.js";
import booksApi from "./features/books/booksApi.js";
import ordersApi from "./features/orders/ordersApi.js";
import oldBooksApi from "./features/soldOldBooks/old.book.api.js";
import { esewaApi } from "./features/esewa/esewa.api.js";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    [booksApi.reducerPath]: booksApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
    [oldBooksApi.reducerPath]: oldBooksApi.reducer,
    [esewaApi.reducerPath]: esewaApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      booksApi.middleware,
      ordersApi.middleware,
      oldBooksApi.middleware,
      esewaApi.middleware
    ),
});

import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../redux/features/carts/cartSlice.js";
import booksApi from "./features/books/booksApi.js";
import ordersApi from "./features/orders/ordersApi.js";
import oldBooksApi from "./features/soldOldBooks/old.book.api.js";
import historyApi from "./features/history/historyApi.js";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    [booksApi.reducerPath]: booksApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
    [oldBooksApi.reducerPath]: oldBooksApi.reducer,
    [historyApi.reducerPath]: historyApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      booksApi.middleware,
      ordersApi.middleware,
      oldBooksApi.middleware,
      historyApi.middleware
    ),
});

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getBaseUrl from "../../../utils/baseURL";

const baseQuery = fetchBaseQuery({
  baseUrl: `${getBaseUrl()}/api/sellbook`,
  credentials: "include",
  prepareHeaders: (Headers) => {
    const token = localStorage.getItem("token");
    if (token) {
      Headers.set("Authorization", `Bearer ${token}`);
    }
    return Headers;
  },
});

const oldBooksApi = createApi({
  reducerPath: "oldBooksApi",
  baseQuery,
  tagTypes: ["OldBooks"],
  endpoints: (builder) => ({
    addOldBook: builder.mutation({
      query: (newBook) => ({
        url: `/sell-old-book`,
        method: "POST",
        body: newBook,
      }),
      invalidatesTags: ["OldBooks"],
    }),
    getAllSoldBooks: builder.query({
      query: (email) => ({
        url: `/sold-books-history/${email}`,
        method: "GET",
      }),
      providesTags: ["OldBooks"],
    }),
    deleteOldBook: builder.mutation({
      query: (id) => ({
        url: `/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["OldBooks"],
    }),
    updateOldBook: builder.mutation({
      query: ({ id, updatedBook }) => ({
        url: `/update/${id}`,
        method: "PUT",
        body: updatedBook,
      }),
      invalidatesTags: ["OldBooks"],
    }),
    getSoldBookByEmail: builder.query({
      query: (email) => ({
        url: `/soldbooksbyemail/${email}`,
        method: "GET",
      }),
      providesTags: ["OldBooks"],
    }),
    getAllSoldBooksByEmail: builder.query({
      query: (email) => ({
        url: `/allsoldbooksbyemail/${email}`,
        method: "GET",
      }),
      providesTags: ["OldBooks"],
    }),
  }),
});

export const {
  useAddOldBookMutation,
  useDeleteOldBookMutation,
  useUpdateOldBookMutation,
  useGetAllSoldBooksQuery,
  useGetSoldBookByEmailQuery,
  useGetAllSoldBooksByEmailQuery,
} = oldBooksApi;
export default oldBooksApi;

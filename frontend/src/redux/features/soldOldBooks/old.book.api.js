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
  }),
});

export const { useAddOldBookMutation } = oldBooksApi;
export default oldBooksApi;

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getBaseUrl from "../../../utils/baseURL";

const baseQuery = fetchBaseQuery({
  baseUrl: `${getBaseUrl()}/api/history`,
  credentials: "include",
  prepareHeaders: (Headers) => {
    const token = localStorage.getItem("token");
    if (token) {
      Headers.set("Authorization", `Bearer ${token}`);
    }
    return Headers;
  },
});

const historyApi = createApi({
  reducerPath: "historyApi",
  baseQuery,
  tagTypes: ["History"],
  endpoints: (builder) => ({
    // Fetch all history records
    fetchHistory: builder.query({
      query: () => "/allhistory",
      providesTags: ["History"],
    }),

    // Delete a specific history record by ID
    deleteHistory: builder.mutation({
      query: (historyId) => ({
        url: `/deletehistory/${historyId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["History"],
    }),

    // Clear all history records
    clearAllHistory: builder.mutation({
      query: () => ({
        url: "/clearhistory",
        method: "DELETE",
      }),
      invalidatesTags: ["History"],
    }),
  }),
});

export const {
  useFetchHistoryQuery,
  useDeleteHistoryMutation,
  useClearAllHistoryMutation,
} = historyApi;

export default historyApi;

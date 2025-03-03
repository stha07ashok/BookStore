import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getBaseUrl from "../../../utils/baseURL";

export const esewaApi = createApi({
  reducerPath: "esewaApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api/esewa`,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    initiatePayment: builder.mutation({
      query: (paymentData) => ({
        url: "/initiate-payment",
        method: "POST",
        body: paymentData,
      }),
    }),
    paymentStatus: builder.mutation({
      query: (statusData) => ({
        url: "/payment-status",
        method: "POST",
        body: statusData,
      }),
    }),
  }),
});

export const { useInitiatePaymentMutation, usePaymentStatusMutation } =
  esewaApi;

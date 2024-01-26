import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { MessageResponse, NewOrderRequest, OrderDetailResponse, OrdersResponse, UpdateOrderRequest } from "../../types/api";

export const orderApi = createApi({
    reducerPath: "orderApi",
    baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/order/` }),
    tagTypes: ["order"],
    endpoints: (builder) => ({
        newOrder: builder.mutation<MessageResponse, NewOrderRequest>({
            query: (order) => ({ url: "new", method: "POST", body: order }),
            invalidatesTags: ["order"]
        }),
        updateOrder: builder.mutation<MessageResponse, UpdateOrderRequest>({
            query: ({ userId, orderId }) => ({ url: `${orderId}?id=${userId}`, method: "PUT" }),
            invalidatesTags: ["order"]
        }),
        deleteOrder: builder.mutation<MessageResponse, UpdateOrderRequest>({
            query: ({ userId, orderId }) => ({ url: `${orderId}?id=${userId}`, method: "DELETE" }),
            invalidatesTags: ["order"]
        }),
        myOrders: builder.query<OrdersResponse, string>({
            query: (id) => (`my?id=${id}`),
            providesTags: ["order"]
        }),
        allOrders: builder.query<OrdersResponse, string>({
            query: (id) => (`all?id=${id}`),
            providesTags: ["order"]
        }),
        orderDetails: builder.query<OrderDetailResponse, string>({
            query: (id) => (id),
            providesTags: ["order"]
        }),
    })
})

export const { useNewOrderMutation, useUpdateOrderMutation, useDeleteOrderMutation, useMyOrdersQuery, useAllOrdersQuery, useOrderDetailsQuery } = orderApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AllProductsResponse, CategoryResponse, MessageResponse, NewProductRequest, SearchProductsParams, SearchProductsResponse } from "../../types/api";

export const productApi = createApi({
    reducerPath: "productApi",
    baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/product/` }),
    tagTypes: ["product"],
    endpoints: (builder) => ({
        latestProducts: builder.query<AllProductsResponse, string>({ query: () => "latest", providesTags: ["product"] }),
        allProducts: builder.query<AllProductsResponse, string>({ query: (id) => `admin-products?id=${id}`, providesTags: ["product"] }),
        categories: builder.query<CategoryResponse, string>({ query: () => `categories`, providesTags: ["product"] }),
        searchProducts: builder.query<SearchProductsResponse, SearchProductsParams>({
            query: ({ price, search, sort, category, page }) => {
                let base = `all?search=${search}&page=${page}`
                if (price) base += `&price=${price}`
                if (sort) base += `&sort=${sort}`
                if (category) base += `&category=${category}`
                return base
            }, providesTags: ["product"]
        }),
        newProduct: builder.mutation<MessageResponse, NewProductRequest>({
            query: ({ id, formData }) => ({
                url: `new?id=${id}`,
                method: "POST",
                body: formData
            }), invalidatesTags: ["product"]
        }),
    })
})

export const { useLatestProductsQuery, useAllProductsQuery, useCategoriesQuery, useSearchProductsQuery, useNewProductMutation } = productApi
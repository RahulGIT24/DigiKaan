import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AllProductsResponse, CategoryResponse, SearchProductsParams, SearchProductsResponse } from "../../types/api";

export const productApi = createApi({
    reducerPath: "productApi",
    baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/product/` }),
    endpoints: (builder) => ({
        latestProducts: builder.query<AllProductsResponse, string>({ query: () => "latest" }),
        allProducts: builder.query<AllProductsResponse, string>({ query: (id) => `admin-products?id=${id}` }),
        categories: builder.query<CategoryResponse, string>({ query: () => `categories` }),
        searchProducts: builder.query<SearchProductsResponse, SearchProductsParams>({
            query: ({ price, search, sort, category, page }) => {
                let base = `all?search=${search}&page=${page}`
                if (price) base += `&price=${price}`
                if (sort) base += `&sort=${sort}`
                if (category) base += `&category=${category}`
                return base
            }
        })
    })
})

export const { useLatestProductsQuery, useAllProductsQuery, useCategoriesQuery, useSearchProductsQuery } = productApi
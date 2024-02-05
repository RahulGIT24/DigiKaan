import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AllProductsResponse, CategoryResponse, DeleteProduct, DeleteReview, MessageResponse, NewProductRequest, ProductResponse, ReviewRequest, SearchProductsParams, SearchProductsResponse, SingleProductResponse, UpdateProductRequest } from "../../types/api";

export const productApi = createApi({
    reducerPath: "productApi",
    baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/product/` }),
    tagTypes: ["product"],
    endpoints: (builder) => ({
        latestProducts: builder.query<AllProductsResponse, string>({ query: () => "latest", providesTags: ["product"] }),
        allProducts: builder.query<AllProductsResponse, string>({ query: (id) => `admin-products?id=${id}`, providesTags: ["product"] }),
        singleProduct: builder.query<SingleProductResponse, string>({ query: (id) => `${id}`, providesTags: ["product"] }),
        categories: builder.query<CategoryResponse, string>({ query: () => `categories`, providesTags: ["product"] }),
        productDetails: builder.query<ProductResponse, string>({ query: (id) => id, providesTags: ["product"] }),
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
        updateProduct: builder.mutation<MessageResponse, UpdateProductRequest>({
            query: ({ userId, productId, formData }) => ({
                url: `${productId}?id=${userId}`,
                method: "PUT",
                body: formData
            }), invalidatesTags: ["product"]
        }),
        deleteProduct: builder.mutation<MessageResponse, DeleteProduct>({
            query: ({ userId, productId }) => ({
                url: `${productId}?id=${userId}`,
                method: "DELETE",
            }), invalidatesTags: ["product"]
        }),
        deleteReview: builder.mutation<MessageResponse, DeleteReview>({
            query: ({ reviewId, productId }) => ({
                url: `delete-review?productId=${productId}&reviewId=${reviewId}`,
                method: "DELETE",
            }), invalidatesTags: ["product"]
        }),
        postReviews: builder.mutation<MessageResponse, ReviewRequest>({
            query: ({ stars, productId, review, userId }) => ({
                url: `post-review`,
                method: "PUT",
                body: {
                    stars, productId, review, userId
                }
            }), invalidatesTags: ["product"]
        }),
    })
})

export const { useLatestProductsQuery, useAllProductsQuery, useCategoriesQuery, useSearchProductsQuery, useNewProductMutation, useUpdateProductMutation, useDeleteProductMutation, useSingleProductQuery, useDeleteReviewMutation,usePostReviewsMutation,useProductDetailsQuery } = productApi
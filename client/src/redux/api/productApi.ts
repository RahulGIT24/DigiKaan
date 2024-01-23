import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AllProductsResponse } from "../../types/api";

export const productApi = createApi({
    reducerPath: "productApi",
    baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/product/` }),
    endpoints: (builder) => ({
        latestProducts:builder.query<AllProductsResponse,string>({query:()=>"latest"})
    })
})

export const {useLatestProductsQuery} = productApi
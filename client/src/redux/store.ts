import { configureStore } from "@reduxjs/toolkit"
import { userApi } from "./api/userApi"
import { userReducer } from "./user/userReducer"
import { productApi } from "./api/productApi"

export const server = import.meta.env.VITE_SERVER

export const store = configureStore({
    reducer: {
        [userApi.reducerPath]: userApi.reducer,
        [productApi.reducerPath]: productApi.reducer,
        [userReducer.name]: userReducer.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(userApi.middleware, productApi.middleware)
})
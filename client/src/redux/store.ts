import { configureStore } from "@reduxjs/toolkit"
import { userApi } from "./api/userApi"

export const server = import.meta.env.VITE_SERVER

export const store = configureStore({
    reducer: {
        [userApi.reducerPath]: userApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(userApi.middleware)
})
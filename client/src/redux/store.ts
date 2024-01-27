import { configureStore } from "@reduxjs/toolkit"
import { userApi } from "./api/userApi"
import { userReducer } from "./reducer/userReducer"
import { productApi } from "./api/productApi"
import { cartReducer } from "./reducer/cartReducer"
import { orderApi } from "./api/orderApi"

export const server = import.meta.env.VITE_SERVER

export const store = configureStore({
    reducer: {
        [userApi.reducerPath]: userApi.reducer,
        [productApi.reducerPath]: productApi.reducer,
        [userReducer.name]: userReducer.reducer,
        [cartReducer.name]: cartReducer.reducer,
        [orderApi.reducerPath]: orderApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(userApi.middleware, productApi.middleware, orderApi.middleware)
})

export type RootState = ReturnType<typeof store.getState>;
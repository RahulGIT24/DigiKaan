import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartReducerInitialState } from "../../types/reducer";
import { CartItem, ShippingInfo } from "../../types/common";

const initialState: CartReducerInitialState = {
    loading: false,
    cartItems: [],
    subTotal: 0,
    tax: 0,
    shippingCharges: 0,
    total: 0,
    discount: 0,
    shippingInfo: {
        address: "",
        city: "",
        pinCode: "",
        country: "",
        state: ""
    }
}

export const cartReducer = createSlice({
    name: "cartReducer",
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<CartItem>) => {
            state.loading = true;
            const index = state.cartItems.findIndex(i => i.productId === action.payload.productId);
            if (index !== -1) state.cartItems[index] = action.payload
            else {
                state.cartItems.push(action.payload)
                state.loading = false;
            }
        },
        removeFromCart: (state, action: PayloadAction<string>) => {
            state.loading = true;
            state.cartItems = state.cartItems.filter((i) => i.productId !== action.payload)
            state.loading = false;
        },
        calculatePrice: (state) => {
            const subTotal = state.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
            state.subTotal = subTotal;
            state.shippingCharges = state.subTotal > 1000 ? 0 : 200;
            state.shippingCharges = state.subTotal === 0 ? 0 : 0
            state.tax = Math.round(subTotal * 0.18);
            state.total = subTotal + state.shippingCharges + state.tax - state.discount
        },
        appliedDiscount: (state, action: PayloadAction<number>) => {
            state.discount = action.payload;
            state.total -= state.discount
        },
        saveShippingInfo: (state, action: PayloadAction<ShippingInfo>) => {
            state.shippingInfo = action.payload;
        },
        resetCart: () => initialState
    }
})

export const { addToCart, removeFromCart, calculatePrice, appliedDiscount, saveShippingInfo, resetCart } = cartReducer.actions
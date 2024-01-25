import { CartItem, ShippingInfo, User } from "./common";

export interface UserReducerInitialState {
    user: User | null,
    loading: boolean
}

export interface CartReducerInitialState {
    loading: boolean,
    cartItems: CartItem[],
    subTotal: number,
    tax: number,
    discount: number,
    shippingCharges: number,
    total: number,
    shippingInfo: ShippingInfo
}
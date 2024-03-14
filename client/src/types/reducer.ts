import { CartItem, ShippingInfo, User } from "./common";

export interface UserReducerInitialState {
    user: User | null,
    loading: boolean,
    flag?:boolean
}

export interface CartReducerInitialState {
    loading: boolean,
    cartItems: CartItem[],
    subtotal: number,
    tax: number,
    discount: number,
    shippingCharges: number,
    total: number,
    shippingInfo: ShippingInfo
}
export type User = {
    name: string,
    email: string,
    photo: string,
    gender: string,
    dob: string,
    _id: string,
    role?: string
}

export interface Product {
    name: string,
    category: string,
    photo: string,
    _id: string,
    price: number,
    stock: number
}

export type ShippingInfo = {
    address: string,
    city: string,
    state: string,
    country: string,
    pinCode: string,
}

export type CartItem = {
    productId: string,
    photo: string,
    name: string,
    price: number,
    quantity: number,
    stock:number
}

export type OrderItem = Omit<CartItem,"stock"> & {_id:string}

export type Order = {
    orderItems:OrderItem[],
    tax: number,
    discount: number,
    shippingCharges: number,
    total: number,
    subtotal:number,
    shippingInfo: ShippingInfo,
    status: string,
    user:{
        name:string,
        _id:string
    },
    _id:string
}
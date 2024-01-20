import { NextFunction, Request, Response } from "express"

export interface NewUserRequestBody {
    name: string,
    email: string,
    photo: string,
    gender: string,
    _id: string,
    dob: string
}

export interface NewProductRequestBody {
    name: string,
    category: string,
    price: number,
    stock: number
}

export type Controller = (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>

export interface BaseQuery {
    name?: {
        $regex: string,
        $options: "i"
    };
    price?: {
        $lte: number
    };
    category?: string
}

export interface invalidateCacheType {
    product?: boolean,
    order?: boolean,
    admin?: boolean,
    user?:string,
    orderId?:string
}

export type OrderItemType = {
    name: string,
    photo: string,
    price: number,
    quantity: number,
    productId: string
}
export type shippingInfoType = {
    address: string,
    city: string,
    state: string,
    country: string,
    pincode: number
}

export interface NewOrderRequestBody {
    shippingInfo: shippingInfoType
    user: string,
    subtotal: number
    tax: number
    shippingCharges: number
    discount: number
    total: number
    orderItems: OrderItemType[]
}
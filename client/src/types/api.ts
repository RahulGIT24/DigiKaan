import { Bar, CartItem, Line, Order, Pie, Product, ShippingInfo, Stats, User } from "./common"

export type CustomError = {
    status: number,
    data: {
        message: string,
        success: boolean
    }
}

export type MessageResponse = { success: boolean, message: string }

export type UserResponse = {
    success: boolean,
    user: User
}

export type AllProductsResponse = {
    success: boolean,
    products: Product[]
}

export type CategoryResponse = {
    success: boolean,
    categories: string[]
}

export type SearchProductsResponse = AllProductsResponse & {
    totalPage: number
}

export type SearchProductsParams = {
    price: number,
    page:number,
    category:string,
    search:string,
    sort:string
}

export type NewProductRequest = {
    id:string,
    formData: FormData
}

export type ProductResponse = {
    success: boolean,
    product: Product
}

export type UpdateProductRequest = {
    productId:string,
    userId:string,
    formData: FormData
}

export type DeleteProduct = {
    productId:string,
    userId:string,
}

export type NewOrderRequest = {
    loading?: boolean,
    orderItems: CartItem[],
    subTotal: number,
    tax: number,
    discount: number,
    shippingCharges: number,
    total: number,
    shippingInfo: ShippingInfo,
    user:string
}

export type OrdersResponse = {
    success: boolean,
    orders: Order[]
}

export type OrderDetailResponse = {
    success: boolean,
    order: Order
}

export type UpdateOrderRequest = {
    userId:string,
    orderId:string
}

export type AllUsersResponse = {
    success:boolean,
    users:User
}

export type DeleteUserRequest = {
    userId:string,
    adminUserId:string
}

export type StatsResponse = {
    success: boolean,
    stats: Stats
}

export type PieResponse = {
    success: boolean,
    charts: Pie
}

export type BarResponse = {
    success: boolean,
    charts: Bar
}

export type LineResponse = {
    success: boolean,
    charts: Line
}
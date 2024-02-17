export type User = {
    name: string,
    email: string,
    photo: string,
    gender: string,
    dob: string,
    _id: string,
    role?: string
}

interface Review {
    stars: number,
    review: string,
    user: User,
    _id: string
}

export interface Product {
    name: string,
    category: string,
    photo: string,
    _id: string,
    price: number,
    stock: number,
    reviews?: Review[],
    avgRating?:Number
}

export type ShippingInfo = {
    address: string,
    city: string,
    state: string,
    country: string,
    pincode: number,
}

export type CartItem = {
    productId: string,
    photo: string,
    name: string,
    price: number,
    quantity: number,
    stock: number
}

export type OrderItem = Omit<CartItem, "stock"> & { _id: string }

export type Order = {
    orderItems: OrderItem[],
    tax: number,
    discount: number,
    shippingCharges: number,
    total: number,
    subtotal: number,
    shippingInfo: ShippingInfo,
    status: string,
    user: {
        name: string,
        _id: string
    },
    _id: string
}

type Count = {
    totalRevenue: number, productCount: number,
    orderCount: number,
    userCount: number
}

type LatestTransaction = {
    _id: string,
    total: number,
    discount: number,
    quantity: number,
    status: string
}

export type Stats = {
    thisMonthRevenue: number,
    user: number,
    order: number,
    product: number,
    count: Count
    chart: {
        order: number[],
        revenue: number[]
    },
    categoryCount: Record<string, number>[],
    userRatio: {
        male: number,
        female: number
    },
    latestTransactions: LatestTransaction[]
}

type RevenueDistribution = {
    netMargin: number,
    productionCost: number,
    burn: number,
    marketingCost: number,
    discount: number
}

export type Pie = {
    orderFullFillMent: {
        processing: number,
        shipped: number,
        delivered: number
    },
    productCategories: Record<string, number>[],
    productCount: number,
    stockAvailability: {
        inStock: number,
        outOfStock: number
    },
    revenueDistribution: RevenueDistribution,
    adminCustomer: {
        admin: number,
        customers: number
    },
    usersAgeGroup: {
        teen: number,
        adult: number,
        old: number
    }
}

export type Bar = {
    users: number[],
    products: number[],
    orders: number[]
}

export type Line = {
    users: number[],
    products: number[],
    discount: number[],
    revenue: number[]
}
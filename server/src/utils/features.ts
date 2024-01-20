import mongoose from "mongoose"
import { OrderItemType, invalidateCacheType } from "../types/types.js";
import { myCache } from "../app.js";
import { Product } from "../models/product.js";
import { Order } from "../models/order.js";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI!, {
            dbName: process.env.DB_NAME!
        })
        console.log("Connected");
        return;
    } catch (error) {
        return error;
    }
}

export const invalidateCache = async ({ product, order, user, orderId, admin = true }: invalidateCacheType) => {
    if (product) {
        const productKeys: string[] = ["categories", "latest-product", "admin-products"];
        const products = await Product.find({}).select("_id");
        products.forEach(element => {
            productKeys.push(`product ${element._id}`)
        });
        myCache.del(productKeys)
    }
    if (order) {
        const orderKeys: string[] = ["all-orders", `my-orders-${user}`, `order-${orderId}`]
        myCache.del(orderKeys);
    }
    if (admin) {
        const adminKeys: string[] = ["admin-stats"];
        myCache.del(adminKeys)
    }
}

export const reduceStock = async (orderItems: OrderItemType[]) => {
    for (let i = 0; i < orderItems.length; i++) {
        const order = orderItems[i];
        const product = await Product.findById(order.productId)
        if (!product) {
            throw new Error("Product not found")
        }
        product.stock -= order.quantity;
        await product.save();
    }
}

export const calculatePercentage = (thisMonth: number, lastMonth: number) => {
    if (lastMonth === 0) {
        return thisMonth * 100;
    }
    const percent = (thisMonth - lastMonth) / lastMonth * 100;
    return Number(percent.toFixed(0));
}
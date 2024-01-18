import mongoose from "mongoose"
import { invalidateCacheType } from "../types/types.js";
import { myCache } from "../app.js";
import { Product } from "../models/product.js";

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

export const invalidateCache = async({ product, order, admin }: invalidateCacheType) => {
    if (product) {
        const productKeys: string[] = ["categories", "latest-product", "admin-products"];
        const products = await Product.find({}).select("_id");
        products.forEach(element => {
            productKeys.push(`product ${element._id}`)
        });
        myCache.del(productKeys)
    }
    if (order) {

    }
    if (admin) {

    }
}
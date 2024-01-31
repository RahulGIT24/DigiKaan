import mongoose, { Document } from "mongoose"
import { OrderItemType, invalidateCacheType } from "../types/types.js";
import { myCache } from "../app.js";
import { Product } from "../models/product.js";
import { v2 as cloudinaryV2 } from 'cloudinary';

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
        const adminKeys: string[] = ["admin-stats", "admin-pie-chart", "admin-bar-chart", "admin-line-chart"];
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

export const appendStock = async ({ orderItems }: any) => {
    console.log(orderItems)
    for (let i = 0; i < orderItems.length; i++) {
        const order = orderItems[i];
        const product = await Product.findById(order.productId)
        if (!product) {
            throw new Error("Product not found")
        }
        product.stock += order.quantity;
        await product.save();
    }
}

export const calculatePercentage = (thisMonth: number, lastMonth: number) => {
    if (lastMonth === 0) {
        return thisMonth * 100;
    }
    const percent = (thisMonth / lastMonth) * 100;
    return Number(percent.toFixed(0));
}

export const getInventories = async ({ categories, productCount }: { categories: string[], productCount: number }) => {
    const categoriesCountPromise = categories.map(category => Product.countDocuments({ category }))
    const categoriesCount = await Promise.all(categoriesCountPromise);
    const categoryCount: Record<string, number>[] = []
    categories.forEach((category, i) => categoryCount.push({
        [category]: Math.round((categoriesCount[i] / productCount) * 100)
    }))
    return categoryCount;
}

interface MyDocument extends Document {
    createdAt: Date,
    discount?: number,
    total?: number
}

type FuncProps = {
    length: number,
    dataArr: MyDocument[],
    today: Date,
    property?: "discount" | "total"
}
export const getChartData = ({ length, dataArr, today, property }: FuncProps) => {
    const data = new Array(length).fill(0);
    dataArr.forEach((i) => {
        const creationDate = i.createdAt
        const monthDifference = (today.getMonth() - creationDate.getMonth() + 12) % 12;
        if (monthDifference < length) {
            data[length - 1 - monthDifference] += property ? i[property]! : 1;
        }
    })
    return data;
}

export const postImage = async (image: any) => {
    const CLOUD_NAME = process.env.CLOUD_NAME;
    const UPLOAD_PRESET = process.env.UPLOAD_PRESET;
    const fileData = await fetch(`${process.env.DOMAIN}/${image.path}`); 
    const blobData = await fileData.blob();

    const formData = new FormData();
    formData.append('file', blobData, image.originalname); 
    formData.append('upload_preset', UPLOAD_PRESET!);

    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME!}/image/upload`,
        {
            method: 'POST',
            body: formData,
        }
    );
    const res = await response.json();
    return res;
};

export const deleteImageByUrl = async (imageUrl: any) => {
    const publicId = imageUrl.split('/').pop().split('.')[0]!;
    try {
        const res = await cloudinaryV2.api.delete_resources(
            [publicId],
            { type: 'upload', resource_type: 'image' }
        );
        return true;
    } catch (e) {
        console.log(e)
        return false;
    }
};

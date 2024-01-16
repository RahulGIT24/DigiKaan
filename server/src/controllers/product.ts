import { Request } from "express";
import ErrorHandler, { TryCatch } from "../utils/utility-class.js";
import { NewProductRequestBody } from "../types/types.js";
import { Product } from "../models/product.js";
import { rm } from "fs";

export const newProduct = TryCatch(
    async (req: Request<{}, {}, NewProductRequestBody>, res, next) => {
        const { name, category, stock, price } = req.body;
        const photo = req.file;
        if (!photo) {
            return next(new ErrorHandler("Please upload the photo", 400));
        }
        if (!name || !category || !stock || !price) {
            rm(photo?.path, () => {
                console.log("Deleted");
            })
            return next(new ErrorHandler("Please fill all fields", 400));
        }
        await Product.create({
            name, category: category?.toLowerCase(), stock, price, photo: photo?.path
        })
        return res.status(201).json({
            success: true, message: "Product created successfully"
        })
    }
)

export const getLatestProducts = TryCatch(
    async (req: Request<{}, {}, NewProductRequestBody>, res, next) => {
        const products = await Product.find({}).sort({createdAt:-1}).limit(5);
        console.log(products);
        return res.status(200).json({
            success: true, products
        })
    }
)
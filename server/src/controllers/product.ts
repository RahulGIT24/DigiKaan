import { Request } from "express";
import ErrorHandler, { TryCatch } from "../utils/utility-class.js";
import { NewProductRequestBody } from "../types/types.js";
import { Product } from "../models/product.js";

export const newProduct = TryCatch(
    async (req: Request<{}, {}, NewProductRequestBody>, res, next) => {
        const { name, category, stock, price } = req.body;
        if(!name || !category || !stock || !price){
            next(new ErrorHandler("Please fill all fields", 400));
        }
        const photo = req.file;
        if (!photo) {
            next(new ErrorHandler("Please upload the photo", 400));
        }
        await Product.create({
            name, category: category?.toLowerCase(), stock, price, photo: photo?.path
        })
        return res.status(201).json({
            success: true, message: "Product created successfully"
        })
    }
)
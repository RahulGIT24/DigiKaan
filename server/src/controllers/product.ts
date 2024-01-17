import { Request } from "express";
import ErrorHandler, { TryCatch } from "../utils/utility-class.js";
import { BaseQuery, NewProductRequestBody } from "../types/types.js";
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
        const products = await Product.find({}).sort({ createdAt: -1 }).limit(5);
        return res.status(200).json({
            success: true, products
        })
    }
)

export const getAllCategories = TryCatch(
    async (req: Request<{}, {}, NewProductRequestBody>, res, next) => {
        const categories = await Product.distinct("category");
        return res.status(200).json({
            success: true, categories
        })
    }
)

export const getAdminProducts = TryCatch(
    async (req: Request<{}, {}, NewProductRequestBody>, res, next) => {
        const products = await Product.find({});
        return res.status(200).json({
            success: true, products
        })
    }
)

export const getSingleProduct = TryCatch(
    async (req, res, next) => {
        const product = await Product.findById(req.params.id);
        return res.status(200).json({
            success: true, product
        })
    }
)

export const updateProduct = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    const { name, price, stock, category } = req.body;
    const photo = req.file;
    const product = await Product.findById(id);

    if (!product) return next(new ErrorHandler("Product Not Found", 404));

    if (photo) {
        rm(product.photo!, () => {
            console.log("Old Photo Deleted");
        });
        product.photo = photo.path;
    }

    if (name) product.name = name;
    if (price) product.price = price;
    if (stock) product.stock = stock;
    if (category) product.category = category;

    await product.save();

    return res.status(200).json({
        success: true,
        message: "Product Updated Successfully",
    });
});

export const deleteProduct = TryCatch(
    async (req, res, next) => {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) {
            return next(new ErrorHandler("Product not found", 404))
        }
        rm(product.photo, () => {
            console.log("Product Photo Deleted");
        })
        await Product.findByIdAndDelete(id);

        return res.status(200).json({
            success: true, message: "Product deleted successfully"
        })
    }
)

export const getAllProducts = TryCatch(
    async (req: Request<{}, {}, NewProductRequestBody>, res, next) => {
        const { search, sort, category, price } = req.query;
        const page = Number(req.query.page) || 1;
        const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
        const skip = limit * (page - 1);

        const baseQuery: BaseQuery = {}

        if (search) {
            baseQuery.name = {
                $regex: String(search),
                $options: "i"
            }
        }
        if (price) {
            baseQuery.price = {
                $lte: Number(price)
            }
        }
        if (category) {
            baseQuery.category = String(category)
        }

        const [products, filteredOnlyProducts] = await Promise.all([
            Product.find(baseQuery).sort(sort ? { price: sort === "asc" ? 1 : -1 } : undefined).limit(limit).skip(skip), Product.find(baseQuery)
        ])

        const totalPage = Math.ceil(filteredOnlyProducts.length / limit);

        return res.status(200).json({
            success: true, products, totalPage
        })
    }
)
import { Request } from "express";
import ErrorHandler, { TryCatch } from "../utils/utility-class.js";
import { BaseQuery, NewProductRequestBody } from "../types/types.js";
import { Product } from "../models/product.js";
import { rm } from "fs";
import { myCache } from "../app.js";
import { invalidateCache } from "../utils/features.js";

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
        await invalidateCache({ product: true, order:true })
        return res.status(201).json({
            success: true, message: "Product created successfully"
        })
    }
)

// revalidate on new update or delete product and new order also
export const getLatestProducts = TryCatch(
    async (req: Request<{}, {}, NewProductRequestBody>, res, next) => {
        let products;
        if (myCache.has("latest-product")) {
            products = JSON.parse(myCache.get("latest-product") as string);
        } else {
            products = await Product.find({}).sort({ createdAt: -1 }).limit(5);
            myCache.set("latest-product", JSON.stringify(products));
        }
        return res.status(200).json({
            success: true, products
        })
    }
)

// revalidate on new update or delete product and new order also
export const getAllCategories = TryCatch(
    async (req: Request<{}, {}, NewProductRequestBody>, res, next) => {
        let categories;
        if (myCache.has("categories")) {
            categories = JSON.parse(myCache.get("categories") as string);
        } else {
            categories = await Product.distinct("category");
            myCache.set("categories", JSON.stringify(categories))
        }
        return res.status(200).json({
            success: true, categories
        })
    }
)

// revalidate on new update or delete product and new order also
export const getAdminProducts = TryCatch(
    async (req: Request<{}, {}, NewProductRequestBody>, res, next) => {
        let products;
        if (myCache.has("admin-products")) {
            products = JSON.parse(myCache.get("admin-products") as string);
        } else {
            products = await Product.find({});
            myCache.set("admin-products", JSON.stringify(products))
        }

        return res.status(200).json({
            success: true, products
        })
    }
)

export const getSingleProduct = TryCatch(
    async (req, res, next) => {
        let product;
        const id = req.params.id;
        if (myCache.has(`product ${id}`)) {
            product = JSON.parse(myCache.get(`product ${id}`) as string)
        } else {
            product = await Product.findById(id);
            myCache.set(`product ${id}`, JSON.stringify(product));
        }

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
    await invalidateCache({ product: true, order:true })
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
        await invalidateCache({ product: true, order:true })
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
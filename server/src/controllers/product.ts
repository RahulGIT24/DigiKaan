import { Request } from "express";
import ErrorHandler, { TryCatch } from "../utils/utility-class.js";
import { BaseQuery, NewProductRequestBody, ReviewRequestBody } from "../types/types.js";
import { Product } from "../models/product.js";
import { rm } from "fs";
import { myCache } from "../app.js";
import { deleteImageByUrl, invalidateCache, postImage } from "../utils/features.js";


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
        const cloudinaryResponse = await postImage(req.file);
        if (cloudinaryResponse.error) return res.status(400).json({
            success: false, message: "Error while uploading image"
        });
        await Product.create({
            name, category: category?.toLowerCase(), stock, price, photo: cloudinaryResponse.secure_url, totalStars: 0, rating: 0
        })
        rm(photo?.path, () => {
            console.log("Deleted");
        })
        await invalidateCache({ product: true, order: true, admin: true })
        return res.status(201).json({
            success: true, message: "Product created successfully"
        })
    }
)

export const postReviews = TryCatch(
    async (req: Request<{}, {}, ReviewRequestBody>, res, next) => {
        const { stars, review, userId, productId } = req.body;
        if (!stars && !review && !userId && !productId) {
            return next(new ErrorHandler("Please provide all information", 400));
        }
        const product = await Product.findById(productId);
        if (!product) return next(new ErrorHandler("Product Not found", 404));
        product?.reviews.push({
            stars: stars,
            review: review,
            user: userId
        })
        product.totalStars += stars;
        product.avgRating = Math.round(product.totalStars / product.reviews.length * 10) / 10;
        await product?.save();
        await invalidateCache({ product: true })
        return res.status(201).json({
            success: true, message: "Review Posted Successfully"
        })
    }
)

export const deleteReview = TryCatch(
    async (req, res, next) => {
        const { reviewId, productId } = req.query;
        if (!reviewId && !productId) {
            return next(new ErrorHandler("Invalid Query", 400));
        }
        const product = await Product.findById(productId);
        if (!product) {
            return next(new ErrorHandler("Product not found", 400));
        }
        const reviewIndex = product.reviews.findIndex(review => review.id === reviewId);
        if (reviewIndex == -1) {
            return next(new ErrorHandler("Review Not Found", 404));
        }
        const review = product.reviews[reviewIndex];
        const totalStars = product.totalStars - parseInt(review?.stars!);
        product.reviews.splice(reviewIndex, 1);
        let avgRating;
        if (product.reviews.length > 0) {
            avgRating = Math.round(totalStars / (product.reviews.length) * 10) / 10;
        } else {
            avgRating = 0;
        }

        await Product.updateOne(
            { _id: productId },
            { $set: { reviews: product.reviews, totalStars, avgRating } },
        );

        await invalidateCache({ product: true })
        return res.status(201).json({
            success: true, message: "Review Deleted"
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
            product = await Product.findById(id).populate('reviews.user');
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
    const product = await Product.findById(id);

    if (!product) return next(new ErrorHandler("Product Not Found", 404));

    if (req.file) {
        const cloudinaryResponse = await postImage(req.file);
        if (cloudinaryResponse.error) return res.status(400).json({
            success: false, message: "Error while updating image!"
        });
        const imageDel = await deleteImageByUrl(product.photo);
        if (!imageDel) return res.status(400).json({
            success: false, message: "Image can't be deleted"
        });
        product.photo = cloudinaryResponse.secure_url;
    }
    if (name) product.name = name;
    if (price) product.price = price;
    if (stock) product.stock = stock;
    if (category) product.category = category;

    await product.save();
    await invalidateCache({ product: true, order: true, admin: true })
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
        const imageDel = await deleteImageByUrl(product.photo);
        if (!imageDel) return res.status(400).json({
            success: false, message: "Image can't be deleted"
        });
        await Product.findByIdAndDelete(id);
        await invalidateCache({ product: true, order: true, admin: true })
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

        let sortQuery = {}

        if (sort === "rating") {
            sortQuery = { avgRating: -1 } // sorting by rating in desending order
        } else {
            sortQuery = { price: sort === "asc" ? 1 : -1 }
        }

        const [products, filteredOnlyProducts] = await Promise.all([
            Product.find(baseQuery).sort(sort ? sortQuery : undefined).limit(limit).skip(skip), Product.find(baseQuery)
        ])

        const totalPage = Math.ceil(filteredOnlyProducts.length / limit);

        return res.status(200).json({
            success: true, products, totalPage
        })
    }
)
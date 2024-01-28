import { Request } from "express";
import ErrorHandler, { TryCatch } from "../utils/utility-class.js";
import { CouponType } from "../types/types.js";
import { Coupon } from "../models/coupon.js";
import { stripe } from "../app.js";

export const createPaymentIntent = TryCatch(
    async (req: Request<{}, {}, CouponType>, res, next) => {
        const { amount, name } = req.body;
        if (!amount) return next(new ErrorHandler("Please enter amount", 400))
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Number(amount * 100),
            currency: "inr",
            description: "Digikaan Services",
            shipping: {
                name,
                address: {
                    line1: '510 Townsend St',
                    postal_code: '98140',
                    city: 'San Francisco',
                    state: 'CA',
                    country: 'US',
                },
            },
            payment_method_types: ['card']
        });
        return res.status(201).json({
            success: true,
            clientSecret: paymentIntent.client_secret,
        })
    }
)
export const newCoupon = TryCatch(
    async (req: Request<{}, {}, CouponType>, res, next) => {
        const { coupon, amount } = req.body;
        if (!coupon || !amount) return next(new ErrorHandler("Please give coupon and amount both", 400))
        await Coupon.create({ code: coupon, amount });
        return res.status(201).json({
            success: true,
            message: "Coupon created successfully"
        })
    }
)
export const applyDiscount = TryCatch(
    async (req, res, next) => {
        const { coupon } = req.query;
        if (!coupon) return next(new ErrorHandler("Please enter coupon", 404))
        const discount = await Coupon.findOne({ code: coupon });
        if (!discount) return next(new ErrorHandler("Invalid coupon code", 401))
        return res.status(200).json({
            success: true,
            discount: discount.amount
        })
    }
)
export const allCoupon = TryCatch(
    async (req, res, next) => {
        const coupon = await Coupon.find();
        return res.status(200).json({
            success: true,
            coupon
        })
    }
)
export const deleteCoupon = TryCatch(
    async (req, res, next) => {
        const { couponId } = req.query;
        if (!couponId) return next(new ErrorHandler("Coupon Id not found", 404))
        const coupon = await Coupon.findByIdAndDelete(couponId);
        if (!coupon) return next(new ErrorHandler("Coupon not found", 404))
        return res.status(200).json({
            success: true,
            message: "Coupon Deleted!"
        })
    }
)
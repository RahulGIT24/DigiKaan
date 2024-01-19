import { Request } from "express";
import { NewOrderRequestBody } from "../types/types.js";
import ErrorHandler, { TryCatch } from "../utils/utility-class.js";
import { Order } from "../models/order.js";
import { invalidateCache, reduceStock } from "../utils/features.js";

export const newOrder = TryCatch(
    async (req: Request<{}, {}, NewOrderRequestBody>, res, next) => {
        const { shippingInfo, orderItems, user, subtotal, tax, shippingCharges, discount, total } = req.body;
        if (!shippingInfo || !user || !subtotal || !tax || !total) {
            return next(new ErrorHandler("Fill all the details!", 400))
        }
        await Order.create({ shippingInfo, user, subtotal, shippingCharges, discount, total, tax, orderItems })
        await reduceStock(orderItems);
        await invalidateCache({ product: true, order: true, admin: true })

        res.status(201).json({
            success: true, message: "Order Placed"
        })
    }
)
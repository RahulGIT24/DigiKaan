import { Request } from "express";
import { NewOrderRequestBody } from "../types/types.js";
import ErrorHandler, { TryCatch } from "../utils/utility-class.js";
import { Order } from "../models/order.js";
import { invalidateCache, reduceStock } from "../utils/features.js";
import { myCache } from "../app.js";

export const newOrder = TryCatch(
    async (req: Request<{}, {}, NewOrderRequestBody>, res, next) => {
        const { shippingInfo, orderItems, user, subtotal, tax, shippingCharges, discount, total } = req.body;
        if (!shippingInfo || !user || !subtotal || !tax || !total) {
            return next(new ErrorHandler("Fill all the details!", 400))
        }
        await Order.create({ shippingInfo, user, subtotal, shippingCharges, discount, total, tax, orderItems })
        await reduceStock(orderItems);
        await invalidateCache({ product: true, order: true, admin: true, user })

        res.status(201).json({
            success: true, message: "Order Placed"
        })
    }
)
export const myOrders = TryCatch(
    async (req: Request<{}, {}, NewOrderRequestBody>, res, next) => {
        const { id } = req.query;
        let orders = [];
        if (myCache.has(`my-orders-${id}`)) orders = JSON.parse(myCache.get(`my-orders-${id}`) as string);
        else {
            orders = await Order.find({ user: id }).populate("user", "name");;
            myCache.set(`my-orders-${id}`, JSON.stringify(orders))
        }
        res.status(201).json({
            success: true, orders
        })
    }
)
export const allOrders = TryCatch(
    async (req: Request<{}, {}, NewOrderRequestBody>, res, next) => {
        let orders = [];
        if (myCache.has(`all-orders`)) orders = JSON.parse(myCache.get(`all-orders`) as string);
        else {
            orders = await Order.find({}).populate("user", "name");
            myCache.set(`all-orders`, JSON.stringify(orders))
        }
        res.status(201).json({
            success: true, orders
        })
    }
)
export const getSingleOrder = TryCatch(
    async (req, res, next) => {
        const { id } = req.params;
        let order;
        if (myCache.has(`order-${id}`)) order = JSON.parse(myCache.get(`order-${id}`) as string);
        else {
            order = await Order.findById(id).populate("user", "name");
            if (!order) return next(new ErrorHandler("Order not found", 404))
            myCache.set(`order-${id}`, JSON.stringify(order))
        }
        res.status(201).json({
            success: true, order
        })
    }
)

export const processOrder = TryCatch(
    async (req, res, next) => {
        const { id } = req.params;
        const order = await Order.findById(id);
        if (!order) return next(new ErrorHandler("Order not found", 404));
        switch (order.status) {
            case "Processing":
                order.status = "Shipped";
                break;
            case "Shipped":
                order.status = "Delivered";
                break;
            default: order.status = "Delivered";
                break;
        }
        await order.save();
        await invalidateCache({ product: false, order: true, admin: true, user:order.user, orderId:id })
        res.status(201).json({
            success: true, message: "Order Processed Successfully"
        })
    }
)

export const deleteOrder = TryCatch(
    async (req, res, next) => {
        const { id } = req.params;
        const order = await Order.findByIdAndDelete(id);
        if (!order) return next(new ErrorHandler("Order not found", 404));
        await invalidateCache({ product: false, order: true, admin: true,  user:order.user, orderId:id})
        res.status(201).json({
            success: true, message: "Order Deleted"
        })
    }
)
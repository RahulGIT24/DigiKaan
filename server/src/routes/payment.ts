import express from "express"

// controllers
import { adminOnly } from "../middlewares/auth.js";
import { allCoupon, applyDiscount, deleteCoupon, newCoupon } from "../controllers/payment.js";

const app = express.Router();

// route -> /api/v1/payment/coupon/new
app.post("/coupon/new", adminOnly, newCoupon);
// route -> /api/v1/payment/coupon/all
app.get("/coupon/all", adminOnly, allCoupon);
// route -> /api/v1/payment/coupon/delete
app.delete("/coupon/delete", adminOnly, deleteCoupon);
// route -> /api/v1/payment/discount
app.get("/discount", applyDiscount);

export default app;
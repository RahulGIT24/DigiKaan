import express from "express"
import NodeCache from "node-cache";
import { config } from "dotenv";
import cors from "cors"
import cloudinary from 'cloudinary';

const app = express();
config()
app.use(express.json());
app.use(cors())

const port = process.env.PORT || 5000;
const stripeKey = process.env.STRIPE_KEY || "";

cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET, secure: true
})
connectDB();

export const myCache = new NodeCache()
export const stripe = new Stripe(stripeKey)

// Importing routes
import userRoutes from "./routes/user.js"
import productRoutes from "./routes/products.js"
import orderRoutes from "./routes/orders.js"
import paymentRoute from "./routes/payment.js"
import statsRoute from "./routes/stats.js"
import { connectDB } from "./utils/features.js";
import { errorMiddleWare } from "./middlewares/error.js";
import Stripe from "stripe";


// using routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1/payment", paymentRoute);
app.use("/api/v1/dashboard", statsRoute);

app.use("/uploads", express.static("uploads"))
app.use(errorMiddleWare)

app.listen(port, () => {
    console.log("Server is listening at Port " + port);
})
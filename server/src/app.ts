import express from "express"
import NodeCache from "node-cache";
import { config } from "dotenv";
const app = express();
config({
    path:"../.env"
})
app.use(express.json());
const port = process.env.PORT || 5000;
connectDB();

export const myCache = new NodeCache()

// Importing routes
import userRoutes from "./routes/user.js"
import productRoutes from "./routes/products.js"
import orderRoutes from "./routes/orders.js"
import { connectDB } from "./utils/features.js";
import { errorMiddleWare } from "./middlewares/error.js";

// using routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/order", orderRoutes);

app.use("/uploads",express.static("uploads"))
app.use(errorMiddleWare)

app.listen(port, () => {
    console.log("Server is listening at Port " + port);
})
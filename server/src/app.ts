import express from "express"
import NodeCache from "node-cache";
const app = express();
app.use(express.json());
const port = 3000;
connectDB();

export const myCache = new NodeCache()

// Importing routes
import userRoutes from "./routes/user.js"
import productRoutes from "./routes/products.js"
import { connectDB } from "./utils/features.js";
import { errorMiddleWare } from "./middlewares/error.js";

// using routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/product", productRoutes);

app.use("/uploads",express.static("uploads"))
app.use(errorMiddleWare)

app.listen(port, () => {
    console.log("Server is listening at Port " + port);
})
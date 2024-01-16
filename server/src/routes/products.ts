import express from "express"
import { adminOnly } from "../middlewares/auth.js";
import { newProduct } from "../controllers/product.js";
import { singleUpload } from "../middlewares/multer.js";

const app = express.Router();

app.post("/new",adminOnly,singleUpload,newProduct)

export default app;
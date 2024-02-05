import express from "express"
import { adminOnly } from "../middlewares/auth.js";
import { deleteProduct, deleteReview, getAdminProducts, getAllCategories, getAllProducts, getLatestProducts, getSingleProduct, newProduct, postReviews, updateProduct } from "../controllers/product.js";
import { singleUpload } from "../middlewares/multer.js";

const app = express.Router();

app.post("/new", adminOnly, singleUpload, newProduct)
app.get("/latest", getLatestProducts)
app.get("/all", getAllProducts) 
app.get("/categories", getAllCategories)
app.get("/admin-products", adminOnly, getAdminProducts)
app.put("/post-review",postReviews)
app.delete("/delete-review",deleteReview)
app.route("/:id").get(getSingleProduct).put(adminOnly, singleUpload,updateProduct).delete(adminOnly, deleteProduct)

export default app;
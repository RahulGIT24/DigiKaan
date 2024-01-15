import express from "express"

const app = express();
app.use(express.json());
const port = 3000;
connectDB();

// Importing routes
import userRoutes from "./routes/user.js"
import { connectDB } from "./utils/features.js";

// using routes
app.use("/api/v1/user", userRoutes);

app.listen(port, () => {
    console.log("Server is listening at Port " + port);
})
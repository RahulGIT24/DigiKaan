import mongoose from "mongoose"

export const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017", {
            dbName: "Ecommerce_Store"
        })
        console.log("Connected");
        return;
    } catch (error) {
        return error;
    }
}
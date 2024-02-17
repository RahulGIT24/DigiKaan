import mongoose from "mongoose";

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter name"]
    },
    photo: {
        type: String,
        required: [true, "Please give a photo"]
    },
    price: {
        type: Number,
        required: [true, "Please give a price"]
    },
    stock: {
        type: Number,
        required: [true, "Please enter the stock"]
    },
    category: {
        type: String,
        required: [true, "Please enter product's category"],
        trim: true
    },
    totalStars:{
        type: Number,
        required:true,
        default: 0,
    },
    avgRating:{
        type: Number,
        required:true,
        default: 0,
    },
    reviews: [
        {
            stars: { type: String, required: [true, "Provide stars"] },
            review: { type: String, required: [true, "Provide review"] },
            user: {
                type: String,
                ref: "User",
                required: true
            },
        }
    ]
}, {
    timestamps: true
})

export const Product = mongoose.model("Product", schema)

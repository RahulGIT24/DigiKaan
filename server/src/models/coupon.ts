import mongoose from "mongoose"

const schema = new mongoose.Schema({
    code:{
        type:String,
        required:[true,"Please enter the coupon code"],
        unique:true
    },
    amount:{
        type:Number,
        required:[true,"Please enter discount amount"]
    }
})  

export const Coupon =  mongoose.model("coupon",schema)
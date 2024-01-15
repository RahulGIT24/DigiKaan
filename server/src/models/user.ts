import mongoose from "mongoose";
import validator from "validator"

interface IUSer extends Document{
    _id:string;
    name:string;
    photo:string;
    email:string;
    role:"admin"|"user";
    gender:"male"|"female";
    dob:Date;
    createdAt:Date;
    updatedAt:Date;
    // virtual attribute
    age:number;
}

const schema = new mongoose.Schema({
    _id: {
        type: String,
        required: [true, "Please enter id"]
    },
    name: {
        type: String,
        required: [true, "Please enter name"]
    },
    email: {
        type: String,
        unique: [true, "Email already exist"],
        required: [true, "Please enter email"],
        validate: validator.default.isEmail
    },
    photo: {
        type: String,
        required: [true, "Please enter photo"]
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    },
    gender: {
        type: String,
        enum: ["male", "female"],
        required: [true, "Please enter your gender"]
    },
    dob: {
        type: Date,
        required: [true, "Please enter your date of birth"]
    },
}, {
    timestamps: true
})

schema.virtual("age").get(function () {
    const today = new Date();
    const dob = this.dob;
    let age = today.getFullYear() - dob.getFullYear();
    if (today.getMonth() < dob.getMonth() || today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate()) {
        age--;
    }
    return age;
});

export const User = mongoose.model<IUSer>("User", schema)

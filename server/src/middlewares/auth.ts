// Middleware to make sure only admin is allowed

import { User } from "../models/user.js";
import ErrorHandler, { TryCatch } from "../utils/utility-class.js";

export const adminOnly = TryCatch(
    async (req, res, next) => {
        const { id } = req.query;
        if (!id) {
            return next(new ErrorHandler("Unauthorized Request", 401))
        }
        const user = await User.findById(id);
        if (!user) {
            return next(new ErrorHandler("User not Found", 401))
        }
        if (user.role !== "admin") {
            return next(new ErrorHandler("You are not admin", 401))
        }
        next();
    }
)
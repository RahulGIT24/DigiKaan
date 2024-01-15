import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.js";
import { NewUserRequestBody } from "../types/types.js";


export const newUser = async (req: Request<{}, {}, NewUserRequestBody>, res: Response, next: NextFunction) => {
    try {
        const { name, email, photo, gender, _id, dob } = req.body;

        const user = await User.create({
            _id, name, email, photo, gender, dob:new Date(dob)
        })

        return res.status(201).send({
            success: true,
            message: `Welcome, ${user.name}`
        })
    } catch (e) {
        return res.status(500).send({
            success: false,
            message: e
        })
    }
};
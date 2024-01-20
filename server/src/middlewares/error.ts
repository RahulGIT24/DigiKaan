import { NextFunction, Request, Response } from "express"
import ErrorHandler from "../utils/utility-class.js";

export const errorMiddleWare = (err:ErrorHandler,req:Request,res:Response,next:NextFunction)=>{
    err.message ||="Server Error"; 
    err.statusCode ||= 500;
    if(err.name === "CastError") err.message = "Invalid Id"
    return res.status(err.statusCode).json({
        success:false,
        message:err.message
    })
} 
import { NextFunction, Request, Response } from "express"

export interface NewUserRequestBody {
    name: string,
    email: string,
    photo: string,
    gender: string,
    _id: string,
    dob: string
}

export interface NewProductRequestBody {
    name: string,
    category: string,
    price: number,
    stock:number
}

export type Controller = (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>
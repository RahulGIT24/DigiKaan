export interface User{
    name:string,
    email:string,
    photo:string,
    gender:string,
    dob:string,
    _id:string,
    role?:string
}

export interface Product{
    name:string,
    category:string,
    photo:string,
    _id:string,
    price:number,
    stock:number
}
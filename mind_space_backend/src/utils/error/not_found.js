import { AppError } from "./AppError.js"

export const notfound=(req,res,next)=>{
    return next(new AppError("url not found",404))
}
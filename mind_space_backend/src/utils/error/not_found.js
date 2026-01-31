export const notfound=(req,res,next)=>{
    return next(new Error("url not found",{cause:404}))
}
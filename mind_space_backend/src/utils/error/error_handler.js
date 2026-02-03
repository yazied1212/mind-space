export const errorHandler=(error,req,res,next)=>{

    return res.status(error.statusCode).json({
        success:false,
        message:error.message,
    })

}
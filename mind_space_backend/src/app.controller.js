import { isConnected } from "./db/connect.js"
import { errorHandler, notfound } from "./utils/index.js"
import authRouter from "./modules/auth/auth.controller.js"
import userRouter from "./modules/user/user.controller.js"
import articleRouter from "./modules/article/article.controller.js"
import commentRouter from "./modules/comment/comment.controller.js"

export const bootStrap=async(express,app)=>{
    app.use(express.json())

    await isConnected()

    app.use("/auth",authRouter)
    app.use("/user",userRouter)
    app.use("/article",articleRouter)
    app.use("/comment",commentRouter)

    
    app.use(("*path"),notfound)

    app.use(errorHandler)
}
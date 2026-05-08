import express from "express"
import { bootStrap } from "./src/app.controller.js"
import { initSocket } from "./src/socket_io/index.js"
const app =express()
const port=process.env.PORT||3000
bootStrap(express,app)
app.get('/', (req, res,next) => {
 return res.json({success:true,message:"hello"});
});
const server=app.listen(port,(req,res,next)=>{  
    console.log("server is running on port",port)
})

initSocket(server);
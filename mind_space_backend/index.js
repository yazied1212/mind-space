import express from "express"
import { bootStrap } from "./src/app.controller.js"
const app =express()
const port=process.env.PORT||3000
bootStrap(express,app)
app.get('/', (req, res) => {
 return res.json({success:true,message:"hello"});
});
app.listen(port,(req,res,next)=>{  
    console.log("server is running on port",port)
})
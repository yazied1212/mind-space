import { Server } from "socket.io"
import { socketAuth } from "./middlewares/socket.auth.js"

export const initSocket=(server)=>{
const io=new Server(server,{cors:"*"})
io.use(socketAuth)
}
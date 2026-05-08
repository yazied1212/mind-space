import { Server} from "socket.io"
import { socketAuth } from "./middlewares/socket.auth.js"
import { handleConnection, handleDisconnection } from "./hooks/online_users.js"
import { joinSession, leaveSession } from "./session/events.js"

export const initSocket=(server)=>{
const io=new Server(server,{cors:"*"})
io.use(socketAuth)
io.on("connection",async(socket)=>{
    handleConnection(socket)

    socket.on("disconnect",()=>{
    handleDisconnection(socket)})

     socket.on("joinSession",async(sessionid)=>{
        await joinSession(socket,sessionId)
     })

     socket.on("leaveSession",async(sessionId)=>{
      await leaveSession(socket,sessionId)
     })
})


}
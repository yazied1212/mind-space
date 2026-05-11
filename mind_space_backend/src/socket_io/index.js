import { Server} from "socket.io"
import { socketAuth } from "./middlewares/socket.auth.js"
import { handleConnection, handleDisconnection } from "./hooks/online_users.js"
import { joinSession, leaveSession } from "./session/events.js"
import { sendGroupMessage } from "./group/events.js"

export const initSocket=(server)=>{
const io=new Server(server,{cors:"*"})
io.use(socketAuth)
io.on("connection",async(socket)=>{
    handleConnection(socket)

    socket.on("disconnect",()=>{
    handleDisconnection(socket)})

     socket.on("joinSession",async(data)=>{
        await joinSession(socket,data)
     })

     socket.on("leaveSession",async(data)=>{
      await leaveSession(socket,data)
     })

     socket.on("sendGroupMessage",async(data)=>{
      await sendGroupMessage(socket,data)
     })
})


}
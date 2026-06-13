import { Server} from "socket.io"
import { socketAuth } from "./middlewares/socket.auth.js"
import { handleConnection, handleDisconnection } from "./hooks/online_users.js"
import { joinSession, leaveSession } from "./session/events.js"
import { sendGroupMessage } from "./group/events.js"
import { catchSocketError } from "./middlewares/socket.error.handler.js"

export const initSocket=(server)=>{
const io=new Server(server,{
  cors: {
    origin: [
      "http://localhost:5173",
      "https://your-frontend-domain.vercel.app",
    ],
    credentials: true,
  },
})
io.use(socketAuth)
io.on("connection",async(socket)=>{
    handleConnection(socket)

    socket.on("disconnect",()=>{
    handleDisconnection(socket)})

     socket.on("joinSession",async(data)=>{
        await catchSocketError(socket,joinSession) 
     })

     socket.on("leaveSession",async(data)=>{
      await catchSocketError(socket,leaveSession) 
     })

     socket.on("sendGroupMessage",async(data)=>{
      await catchSocketError(socket,sendGroupMessage)
     })

      socket.on("sendMessage", async (data) => {
      await catchSocketError(socket,sendMessage)
})
})


}
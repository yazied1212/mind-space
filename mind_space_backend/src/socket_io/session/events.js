import { Session } from "../../db/models/session.js"
import { AppError, messages } from "../../utils/index.js"

export const joinSession=async(socket,sessionId)=>{
    try {
        
        const sessionExists=await Session.findById(sessionId)
        if(!sessionExists){
            return socket.emit("error",{
                message:messages.session.notFound,
                statusCode:404
            })
        }

        const isParticipant=sessionExists.userId===socket.userId||sessionExists.therapistId===socket.userId
        if(!isParticipant){
            return socket.emit("error",{
                message:"you are not allowed to join this session",
                statusCode:401
            
            })
        }

        if(sessionExists.status!=="scheduled"||sessionExists.status!=="ongoing"){
            return socket.emit("error",{
                message:`you cant join a ${sessionExists.status}`,
                statusCode:400
            })
        }

        socket.join(sessionId)

        socket.emit("joinedSession",{data:sessionId,message:"joined successfully"})
    
    } catch (error) {
        return socket.emit("error",{
                message:error.message,
                statusCode:400
            })
        }
    }
    

    
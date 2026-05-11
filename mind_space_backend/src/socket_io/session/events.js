import { Session } from "../../db/models/session.js"
import { AppError, messages } from "../../utils/index.js"

export const joinSession=async(socket,data)=>{
    const {sessionId}=data
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

        const tenMin=10 * 60 * 1000
        if(Date.now() < sessionExists.sessionTime - tenMin ){
            return socket.emit("error",{
                message:`you cant join a now please comeback at ${sessionExists.sessionTime.toISOString()}`,
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
    

    export const leaveSession=async(socket,data)=>{
    const {sessionId}=data

        try {
            const sessionExists=await Session.findById(sessionId)
            if(!sessionExists){
            return socket.emit("error",{
                message:messages.session.notFound,
                statusCode:404
            })
        }
         socket.leave(sessionId)
            socket.emit("leftSession",{data:sessionId,message:"left session successfully"})
        } catch (error) {
            return socket.emit("error",{
                message:error.message,
                statusCode:400
            })
        }
    }
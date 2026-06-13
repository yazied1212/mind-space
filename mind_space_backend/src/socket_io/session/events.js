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

        
        const isParticipant=sessionExists.userId.toString()==socket.userId||sessionExists.therapistId.toString()==socket.userId
        if(!isParticipant){
            return socket.emit("error",{
                message:"you are not allowed to join this session",
                statusCode:401
            
            })
        }

        const tenMin = 10 * 60 * 1000;

        const now = Date.now();
        const sessionTime = new Date(sessionExists.sessionTime).getTime();

        if (now < sessionTime - tenMin) {
        return socket.emit("error", {
         message: `you can't join now, please come back at ${new Date(sessionTime).toISOString()}`,
         statusCode: 400
        } );
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


export const sendMessage = async (socket, data) => {
    const { sessionId, content } = data
    try {

        const sessionExists = await Session.findById(sessionId)
        if (!sessionExists) {
            return socket.emit("error", {
                message: messages.session.notFound,
                statusCode: 404
            })
        }

        const isParticipant = sessionExists.userId.toString() == socket.userId || sessionExists.therapistId.toString() == socket.userId
        if (!isParticipant) {
            return socket.emit("error", {
                message: "you are not allowed to send messages in this session",
                statusCode: 401
            })
        }

        if (!content || !content.trim()) {
            return socket.emit("error", {
                message: "message content cannot be empty",
                statusCode: 400
            })
        }

        sessionExists.messages.push({
             sender: socket.userId,
            message: content
        })
        await sessionExists.save()

        const newMessage = sessionExists.messages[sessionExists.messages.length - 1]
        
        socket.to(sessionId).emit("receiveMessage", {
            data: newMessage,
            message: "new message received"
        })

        socket.emit("messageSent", {
            data: newMessage,
            message: "message sent successfully"
        })

    } catch (error) {
        return socket.emit("error", {
                message: error.message,
                statusCode: 400
            })
        }
    }
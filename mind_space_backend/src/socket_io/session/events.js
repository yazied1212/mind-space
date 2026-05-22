import { Session } from "../../db/models/session.js"
import { AppError, messages } from "../../utils/index.js"
import { JoinRequest } from "../../db/models/joinRequest.js"
import { SG } from "../../db/models/sg.js"
import { GM } from "../../db/models/gm.js"


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


export const requestJoinGroup = async (socket, data) => {
    const { groupId } = data

    try {
        // check group exists
        const group = await SG.findById(groupId)
        if (!group) {
            return socket.emit("error", {
                message: "Group not found",
                statusCode: 404
            })
        }

        // check not already a member
        const alreadyMember = await GM.findOne({
            groupId,
            usersId: socket.userId
        })
        if (alreadyMember) {
            return socket.emit("error", {
                message: "You are already a member of this group",
                statusCode: 400
            })
        }

        // check not already requested
        const alreadyRequested = await JoinRequest.findOne({
            groupId,
            userId: socket.userId,
            status: "pending"
        })
        if (alreadyRequested) {
            return socket.emit("error", {
                message: "You already have a pending request",
                statusCode: 400
            })
        }

        // create request in DB
        const joinRequest = await JoinRequest.create({
            groupId,
            userId: socket.userId
        })

        // notify the user
        socket.emit("joinRequestSent", {
            message: "Your request has been sent",
            data: joinRequest
        })

        // notify the admin
        socket.to(group.adminId.toString()).emit("newJoinRequest", {
            message: "New join request",
            data: joinRequest
        })

    } catch (error) {
        return socket.emit("error", {
            message: error.message,
            statusCode: 400
        })
    }
}
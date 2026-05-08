export const onlineUsers= new Map()

export const handleConnection=(socket)=>{
    const userId=socket.userId.toString()
    onlineUsers.set(userId,socket.id)
}

export const handleDisconnection=(socket)=>{
    const userId=socket.userId.toString()
    onlineUsers.delete(userId,socket.id)
}


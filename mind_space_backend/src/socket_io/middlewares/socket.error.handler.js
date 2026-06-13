export const catchSocketError = (socket, fn) => async (...args) => {
    try {
        await fn(socket, ...args)
    } catch (error) {
        socket.emit("errorMessage", {
            success: false,
            message: error.message,
            statusCode: error.statusCode || 500
        })
    }
}
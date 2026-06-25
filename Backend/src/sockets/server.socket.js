import { Server } from 'socket.io';

let io;

export function initSocket(httpServer) {
    if (!io) {
        io = new Server(httpServer, {
            cors: {
                origin: "http://localhost:5173",
                credentials: true
            }
        });
    }

    io.on('connect', (socket) => {
        console.log('User connected:', socket.id);
    });

    return io;
}

export function getIO() {
    if (!io) {
        throw new Error("Socket.IO not initialized");
    }
    return io;
}

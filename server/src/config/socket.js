import { Server } from "socket.io";

export default function initSocket(httpServer) {
    const io = new Server(httpServer, {
        cors: {
            origin: process.env.CLIENT_URL,
            credentials: true,
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        socket.on("joinConversation", (conversationId) => {
            const roomId = String(conversationId);
            socket.join(roomId);
        });

        socket.on("disconnect", () => {
            // Handle disconnect
        });
    });
    
    return io;
}

import { Server } from "socket.io";
import { getUserSocker, removeUserSocker, setUserSocker } from "../utils/sockerUserMap.js";

export default function initSocket(httpServer) {
    const io = new Server(httpServer, {
        cors: {
            origin: process.env.CLIENT_URL,
            credentials: true,
            methods: ["GET", "POST"]
        }
    });

    // Make io globally accessible for notifications
    global.io = io;

    io.on("connection", (socket) => {
        // Get userId from query and store mapping
        const userId = socket.handshake.query.userId;

        if (userId && userId !== 'null' && userId !== 'undefined') {
            setUserSocker(userId, socket.id);
        }

        socket.on("joinConversation", (conversationId) => {
            const roomId = String(conversationId);
            socket.join(roomId);
        });

        socket.on("disconnect", () => {
            // Remove user from mapping using userId
            if (userId && userId !== 'null' && userId !== 'undefined') {
                removeUserSocker(userId);
            }
        });
    });

    return io;
}

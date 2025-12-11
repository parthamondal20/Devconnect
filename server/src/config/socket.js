import { Server } from "socket.io";
import { getUserSocker, removeUserSocker, setUserSocker } from "../utils/sockerUserMap.js";
import sendPendingNotifications from "../utils/sendPendingNotifications.js";
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

    io.on("connection", async (socket) => {
        // Get userId from query and store mapping
        const userId = socket.handshake.query.userId;
        await sendPendingNotifications(userId, socket);

        if (userId && userId !== 'null' && userId !== 'undefined') {
            console.log("user id is ", userId);
            setUserSocker(userId, socket.id);
        }

        socket.on("joinConversation", (conversationId) => {
            const roomId = String(conversationId);
            socket.join(roomId);
            console.log(`✅ User ${userId} (socket ${socket.id}) joined room ${roomId}`);
            // Acknowledge successful room join
            socket.emit("joinedRoom", { conversationId: roomId, success: true });
        });


        // Typing indicator
        socket.on("typing", ({ toUserId }) => {
            console.log("fromUserId is typing", userId);
            console.log("toUserId is typing", toUserId);
            const toUserSocketId = getUserSocker(toUserId);
            console.log("toUserSocketId is typing", toUserSocketId);
            if (toUserSocketId) {
                socket.to(toUserSocketId).emit("typing", { fromUserId: userId })
            }
        })

        socket.on("stop-typing", ({ toUserId }) => {
            const toUserSocketId = getUserSocker(toUserId);
            if (toUserSocketId) {
                socket.to(toUserSocketId).emit("stop-typing", { fromUserId: userId })
            }
        })
        socket.on("disconnect", () => {
            // Remove user from mapping using userId
            if (userId && userId !== 'null' && userId !== 'undefined') {
                removeUserSocker(userId);
            }
        });
    });

    return io;
}

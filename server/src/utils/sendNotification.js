import { getUserSocker } from "./sockerUserMap.js";
import Notification from "../models/notification.model.js";

const sendNotification = async (senderId, receiverId, type, message, metadata = {}) => {
    try {
        // Create notification in database
        const notification = await Notification.create({
            sender: senderId,
            receiver: receiverId,
            type: type,
            message: message,
            isDelivered: false,
            isRead: false,
            metaData: metadata
        });

        // Populate sender info for real-time notification
        await notification.populate('sender', 'username avatar');

        // Check if receiver is online
        const receiverSocketId = getUserSocker(receiverId.toString());

        if (receiverSocketId && global.io) {
            // Send real-time notification to online user
            global.io.to(receiverSocketId).emit("notification:receive", notification);
        }

        return notification;
    } catch (error) {
        console.error("Error sending notification:", error);
        throw error;
    }
}

export default sendNotification;
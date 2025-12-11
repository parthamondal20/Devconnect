import Notification from "../models/notification.model.js";
import redis from "../config/redis.js";

const sendPendingNotifications = async (userId, socket) => {
    try {
        const pendingNotifications = await redis.lrange(`notification:pending:${userId}`, 0, -1);
        if (pendingNotifications.length > 0) {
            console.log("user is now online");
            for (const notification of pendingNotifications) {
                socket.emit('new_notification', notification);
            }
            await Notification.updateMany(
                { receiver: userId, isDelivered: false },
                { isDelivered: true })
            await redis.del(`notification:pending:${userId}`);
        }
    } catch (error) {
        console.log(error);
    }
}

export default sendPendingNotifications;

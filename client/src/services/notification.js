import api from "../api/axios";

// Get all notifications
export const getNotifications = async (page = 1, limit = 20) => {
    try {
        const response = await api.get(`/notifications?page=${page}&limit=${limit}`);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching notifications:", error);
        throw error;
    }
};

// Get unread notification count
export const getUnreadCount = async () => {
    try {
        const response = await api.get("/notifications/unread-count");
        return response.data.data.unreadCount;
    } catch (error) {
        console.error("Error fetching unread count:", error);
        throw error;
    }
};

// Mark single notification as read
export const markAsRead = async (notificationId) => {
    try {
        const response = await api.patch(`/notifications/${notificationId}/read`);
        return response.data.data;
    } catch (error) {
        console.error("Error marking notification as read:", error);
        throw error;
    }
};

// Mark all notifications as read
export const markAllAsRead = async () => {
    try {
        const response = await api.patch("/notifications/read-all");
        return response.data;
    } catch (error) {
        console.error("Error marking all as read:", error);
        throw error;
    }
};

// Delete notification
export const deleteNotification = async (notificationId) => {
    try {
        const response = await api.delete(`/notifications/${notificationId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting notification:", error);
        throw error;
    }
};

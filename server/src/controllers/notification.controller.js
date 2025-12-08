import Notification from "../models/notification.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

// Get all notifications for logged-in user
const getNotifications = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { page = 1, limit = 20 } = req.query;

    const skip = (page - 1) * limit;

    const notifications = await Notification.find({ receiver: userId })
        .populate('sender', 'username avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

    const total = await Notification.countDocuments({ receiver: userId });

    return res.status(200).json(
        new ApiResponse(200, "Notifications fetched successfully", {
            notifications,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        })
    );
});

// Get unread notification count
const getUnreadCount = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const unreadCount = await Notification.countDocuments({
        receiver: userId,
        isRead: false
    });

    return res.status(200).json(
        new ApiResponse(200, "Unread count fetched successfully", { unreadCount })
    );
});

// Mark single notification as read
const markAsRead = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;

    const notification = await Notification.findOne({
        _id: id,
        receiver: userId
    });

    if (!notification) {
        throw new ApiError(404, "Notification not found");
    }

    notification.isRead = true;
    await notification.save();

    return res.status(200).json(
        new ApiResponse(200, "Notification marked as read", { notification })
    );
});

// Mark all notifications as read
const markAllAsRead = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    await Notification.updateMany(
        { receiver: userId, isRead: false },
        { isRead: true }
    );

    return res.status(200).json(
        new ApiResponse(200, "All notifications marked as read")
    );
});

// Delete a notification
const deleteNotification = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;

    const notification = await Notification.findOneAndDelete({
        _id: id,
        receiver: userId
    });

    if (!notification) {
        throw new ApiError(404, "Notification not found");
    }

    return res.status(200).json(
        new ApiResponse(200, "Notification deleted successfully")
    );
});

export {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification
};

import Conversation from "../models/conversation.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import Message from "../models/message.model.js";
import sendNotification from "../utils/sendNotification.js";
import User from "../models/user.model.js";

// Create a new conversation
const createConversation = asyncHandler(async (req, res) => {
    const { memberIds } = req.body;
    if (!memberIds || memberIds.length < 2) {
        throw new ApiError(400, "At least two members are required to create a conversation");
    }
    let existingConversation = await Conversation.findOne({ members: { $all: memberIds, $size: memberIds.length } });
    if (existingConversation) {
        return res.status(200).json(new ApiResponse(200, "Conversation already exists", existingConversation));
    }
    const conversation = await Conversation.create({ members: memberIds });
    return res.status(201).json(new ApiResponse(201, "Conversation created successfully", conversation));
});

// Get conversations for a user
const getUserConversationById = asyncHandler(async (req, res) => {
    const { conversationId } = req.params;
    const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });
    return res.status(200).json(new ApiResponse(200, "Messages fetched successfully", messages));
});

const getUserConversations = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const conversations = await Conversation.find({ members: userId }).populate("members", "username avatar email").populate("lastMessage");
    return res.status(200).json(new ApiResponse(200, "Conversations fetched successfully", conversations));
});
const sendMessage = asyncHandler(async (req, res) => {
    const { conversationId, text, receiverId } = req.body;
    const senderId = req.user._id;

    if (!conversationId || !text) {
        throw new ApiError(400, "conversationId and text are required");
    }

    const message = await Message.create({ conversationId, sender: senderId, text });
    await Conversation.findByIdAndUpdate(conversationId, {
        lastMessage: message._id,
        updatedAt: Date.now(),
    });

    const io = req.app.get("io");
    if (!io) {
        throw new ApiError(500, "Socket.io not initialized");
    }
    const roomId = String(conversationId);
    io.to(roomId).emit("newMessage", message);
    return res.status(201).json(new ApiResponse(201, "Message sent successfully", message));
});

export { createConversation, getUserConversationById, sendMessage, getUserConversations };
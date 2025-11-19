import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema({
    conversationId: {
        type: Schema.Types.ObjectId,
        ref: "Conversation",
        required: true,
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["sent", "delivered", "seen"],
        default: "sent",
    },
    media: {
        type: [String],// array of media URLs
        default: [],
    }
}, { timestamps: true });

const Message = mongoose.model("Message", messageSchema);
export default Message;
import mongoose, { Schema } from "mongoose";

const conversationSchema = new Schema({
    members: {
        type: [Schema.Types.ObjectId],
        ref: "User",
        required: true,
    },
    lastMessage: {
        type: Schema.Types.ObjectId,
        ref: "Message",
        default: null,
    },
    admin: [{
        type: Schema.Types.ObjectId,
        ref: "User",
    }]
}, { timestamps: true });

conversationSchema.index({ members: 1 });
conversationSchema.index({ updatedAt: -1 });
const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
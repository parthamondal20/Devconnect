import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    type: {
        type: String,
        enum: ["like", "comment", "follow", "answer", "message", "notification"],
        default: "notification"
    },
    message: {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
    isDelivered: {
        type: Boolean,
        default: false
    },
    metaData: {
        type: Object,
        default: {}
    }

}, {
    timestamps: true
})
const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
import mongoose, { Schema } from "mongoose";
const questionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    tags: [{
        type: String,
        trim: true
    }],
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    answers: [{
        type: Schema.Types.ObjectId,
        ref: "Answer"
    }],
    Likes: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    Dislikes: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    LikesCount: {
        type: Number,
        default: 0
    },
    DislikesCount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });
const Question = mongoose.model("Question", questionSchema);

export default Question;

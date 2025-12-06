import mongoose, { Schema } from "mongoose";

const answerSchema = new Schema({
    questionId: {
        type: Schema.Types.ObjectId,
        ref: "Question",
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    answer: {
        type: String,
        required: true
    },
    likesCount: {
        type: Number,
        default: 0
    },
}, {
    timestamps: true
})

const Answer = mongoose.model("Answer", answerSchema)

export default Answer;


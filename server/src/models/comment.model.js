import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Comment author
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true }, // Which post
    text: { type: String, required: true },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }], // Users who liked this comment
    replies: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        text: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);
const Comment = mongoose.model("Comment", commentSchema);
export default Comment;

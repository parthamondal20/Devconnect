import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Who liked
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true }, // Which post
    type: {
      type: String,
      enum: ["like", "love", "wow", "sad", "angry"], // Optional: reactions
      default: "like",
    },
  },
  { timestamps: true }
);
const Like=mongoose.model("Like", likeSchema);
export default Like;

import mongoose, { Schema } from "mongoose";

const postSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    about: { type: String },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
      },
    ], // store URLs
    likesCount: { type: Number, default: 0 },
    likes: [{ type: Schema.Types.ObjectId, ref: "Like" }], // Like references
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    commentsCount: { type: Number, default: 0 },
    shares: [{ type: Schema.Types.ObjectId, ref: "User" }], // user IDs who shared
    shareCount: { type: Number, default: 0 },
    postType: {
      type: String,
      enum: ["text", "image", "video", "link", "poll", "share"],
      default: "text",
    },
    originalPost: { type: Schema.Types.ObjectId, ref: "Post" }, // if share
    visibility: {
      type: String,
      enum: ["public", "friends", "private"],
      default: "public",
    },
    tags: [{ type: Schema.Types.ObjectId, ref: "User" }], // mentions
    hashtags: [{ type: String }],
    location: String,
    edited: { type: Boolean, default: false },
  },
  { timestamps: true }
);
const Post = mongoose.model("Post", postSchema);
export default Post;

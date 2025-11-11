import Comment from "../models/comment.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Post from "../models/post.model.js";
const getComments = asyncHandler(async (req, res) => {
    const { post_id } = req.params;
    const comments = await Comment.find({ post: post_id }).populate("user").sort({ createdAt: -1 });
    return res
        .status(200)
        .json(new ApiResponse(200, "Comments fetched successfully", comments || []));
})

const addComment = asyncHandler(async (req, res) => {
    const { post_id, text } = req.body;
    const user = req?.user;
    if (!user) {
        throw new ApiError(400, "Unorthorized user");
    }
    const newComment = await Comment.create({
        user: user._id,
        post: post_id,
        text
    });
    await Post.findByIdAndUpdate(post_id, { $inc: { commentsCount: 1 } });
    if (!newComment) {
        throw new ApiError(400, "Failed to add comment");
    }
    await newComment.populate("user", "username avatar");
    return res
        .status(200)
        .json(new ApiResponse(200, "Comment added successfully", newComment));
})

export { getComments, addComment };
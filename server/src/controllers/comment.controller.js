import Comment from "../models/comment.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Post from "../models/post.model.js";
import sendNotification from "../utils/sendNotification.js";
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
    let newComment = await Comment.create({
        user: user._id,
        post: post_id,
        text
    });
    await Post.findByIdAndUpdate(post_id, { $inc: { commentsCount: 1 } });
    if (!newComment) {
        throw new ApiError(400, "Failed to add comment");
    }
    newComment = {
        ...newComment.toObject(),
        user: {
            _id: user._id,
            username: user.username,
            avatar: user.avatar
        }
    }
    const post = await Post.findById(post_id);
    if (post.user.toString() !== user._id.toString()) {
        await sendNotification(
            user._id,
            post.user,
            "comment",
            "commented on your post",
            { post: post }
        )
    }
    return res
        .status(200)
        .json(new ApiResponse(200, "Comment added successfully", newComment));
})

const deleteComment = asyncHandler(async (req, res) => {
    const { comment_id } = req.params;
    const user = req?.user;

    if (!user) {
        throw new ApiError(401, "Unauthorized user");
    }

    const comment = await Comment.findById(comment_id);

    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    // Check if the user is the owner of the comment
    if (comment.user.toString() !== user._id.toString()) {
        throw new ApiError(403, "You can only delete your own comments");
    }

    await Comment.findByIdAndDelete(comment_id);
    await Post.findByIdAndUpdate(comment.post, { $inc: { commentsCount: -1 } });

    return res
        .status(200)
        .json(new ApiResponse(200, "Comment deleted successfully", null));
})

export { getComments, addComment, deleteComment };
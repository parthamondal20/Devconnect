import Like from "../models/like.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Post from "../models/post.model.js";

const likePost = asyncHandler(async (req, res) => {
  const { post_id } = req.params;
  const post = await Post.findById(post_id);
  if (!post) {
    throw new ApiError(200, "Post not found");
  }

  const userId = req.user._id;

  if (post.likes.includes(userId)) {
    // If already liked, remove the like
    post.likes = post.likes.filter((id) => id.toString() !== userId);
  } else {
    // Add like
    post.likes.push(userId);
  }

  await post.save();

  return res.status(200).json(new ApiResponse(200, "Liked", post.likes.length));
});

export { likePost };

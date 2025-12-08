import Like from "../models/like.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Post from "../models/post.model.js";
import redis from "../config/redis.js";
import sendNotification from "../utils/sendNotification.js";
const likePost = asyncHandler(async (req, res) => {
  const { post_id } = req.params;
  const post = await Post.findById(post_id);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }
  const redisKey = `post:${post_id}:likes`;
  const userId = req.user._id;
  // normalize user id for redis (store as string)
  const userIdStr = String(userId);
  const alreadyLiked = await redis.sismember(redisKey, userIdStr);

  if (alreadyLiked) {
    // unlike
    await Like.findOneAndDelete({ user: userId, post: post_id });
    await Post.findByIdAndUpdate(post_id, { $inc: { likesCount: -1 } });
    await redis.srem(redisKey, userIdStr);
  } else {
    // like
    await Like.create({ user: userId, post: post_id });
    await Post.findByIdAndUpdate(post_id, { $inc: { likesCount: 1 } });
    await redis.sadd(redisKey, userIdStr);

    // Send notification if not liking own post
    if (post.user.toString() !== userId.toString()) {
      await sendNotification(
        userId,
        post.user,
        "like",
        "liked your post",
        { postId: post._id }
      );
    }
  }
  // Return updated status
  const updatedPost = await Post.findById(post_id).select("likesCount");
  const isLiked = await redis.sismember(redisKey, userIdStr);
  return res
    .status(200)
    .json(new ApiResponse(200, "OK", { likesCount: updatedPost.likesCount, liked: Boolean(isLiked) }));
});

export { likePost };

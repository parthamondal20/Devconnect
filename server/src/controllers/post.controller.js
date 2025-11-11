import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Post from "../models/post.model.js";
import { uploadBufferToCloudinary } from "../config/cloudinary.js";
import redis from "../config/redis.js";
const createPost = asyncHandler(async (req, res) => {
  const user = req.user;
  const { about } = req.body;
  const images = req.files;
  console.log("about is ", about);
  let imageUrls = [];
  if (images && images.length > 0) {
    for (const image of images) {
      const result = await uploadBufferToCloudinary(image.buffer);
      imageUrls.push({
        url: result.secure_url,
        publicId: result.public_id,
      });
    }
  }
  const newPost = await Post.create({
    user: user,
    images: imageUrls,
    about: about,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "Your post posted successfully", newPost));
});

const getPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({}).sort({ createdAt: -1 }).populate("user");

  // If user is authenticated, annotate each post with whether the current user liked it
  const userId = req.user?._id ? String(req.user._id) : null;
  if (userId) {
    const results = await Promise.all(
      posts.map((p) => redis.sismember(`post:${p._id}:likes`, userId))
    );
    const annotated = posts.map((post, index) => {
      const postObj = post.toObject ? post.toObject() : post;
      postObj.likedByCurrentUser = Boolean(results[index]);
      return postObj;
    });
    return res.status(200).json(new ApiResponse(200, "All post is here", annotated));
  }

  return res.status(200).json(new ApiResponse(200, "All post is here", posts));
});
const deletePost = asyncHandler(async (req, res) => {
  const { post_id } = req.params;
  await Post.findByIdAndDelete(post_id);
  return res
    .status(200)
    .json(new ApiResponse(200, "Successfully deleted post"));
});
export { createPost, getPosts, deletePost };

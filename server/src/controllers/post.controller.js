import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Post from "../models/post.model.js";
import redis from "../config/redis.js";
import { uploadToImageKit } from "../config/imagekit.js";
const createPost = asyncHandler(async (req, res) => {
  const user = req.user;
  const { about } = req.body;
  const images = req.files;
  console.log("about is ", about);
  let imageUrls = [];
  if (images && images.length > 0) {
    for (const image of images) {
      const result = await uploadToImageKit(image.buffer, image.originalname);
      imageUrls.push({
        url: result.url,
        publicId: result.fileId,
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
  const posts = await Post.find({}).sort({ createdAt: -1 }).populate("user", "username avatar email");

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

const getPostById = asyncHandler(async (req, res) => {
  const { post_id } = req.params;
  const post = await Post.findById(post_id).populate("user", "username avatar email");
  // Redis stores user IDs as strings, so convert ObjectId to string for lookup
  const userIdStr = String(req.user._id);
  const liked = await redis.sismember(`post:${post_id}:likes`, userIdStr);
  // Convert Mongoose document to plain object so we can add custom properties
  const postObj = post.toObject();
  postObj.likedByCurrentUser = Boolean(liked);
  return res.status(200).json(new ApiResponse(200, "Post is here", postObj));
})

const deletePost = asyncHandler(async (req, res) => {
  const { post_id } = req.params;
  await Post.findByIdAndDelete(post_id);
  return res
    .status(200)
    .json(new ApiResponse(200, "Successfully deleted post"));
});
export { createPost, getPosts, deletePost, getPostById };

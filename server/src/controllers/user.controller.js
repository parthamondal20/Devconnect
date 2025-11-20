import User from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import generateAccessAndRefreshToken from "../utils/generateAccessAndRefreshToken.js";
import Conversation from "../models/conversation.model.js";
import Post from "../models/post.model.js";
const getUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  console.log("user id is  : ", userId);
  const user = await User.findById(userId).select("-password -refreshToken");
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "User fetched successfully", user));
});
import { uploadToImageKit, deleteFromImageKit } from "../config/imagekit.js";
const uploadProfilePicture = asyncHandler(async (req, res) => {
  const user = req?.user;
  const file = req.file;
  if (!file) {
    throw new ApiError(400, "Avatar photo not found!");
  }
  if (!user) {
    throw new ApiError(400, "User not found");
  }
  if (user.avatarPublicId) {
    await deleteFromImageKit(user.avatarPublicId);
  }
  const response = await uploadToImageKit(file.buffer, file.originalname);
  if (!response) {
    throw new ApiError(400, "Failed to change profile picture.Try again");
  }
  user.avatar = response.url;
  user.avatarPublicId = response.fileId;
  await user.save();
  const updatedUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  return res
    .status(200)
    .json(
      new ApiResponse(200, "Profile picture uploaded successfully", updatedUser)
    );
});

const followUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { user_id } = req.body;

  if (userId.toString() === user_id) {
    throw new ApiError(400, "You cannot follow yourself");
  }

  const userToFollow = await User.findById(user_id);
  if (!userToFollow) {
    throw new ApiError(404, "User not found");
  }

  const alreadyFollowing = userToFollow.followers.includes(userId);

  if (alreadyFollowing) {
    // UNFOLLOW
    await User.updateOne(
      { _id: userId },
      { $pull: { following: user_id } }
    );

    await User.updateOne(
      { _id: user_id },
      { $pull: { followers: userId } }
    );

    return res
      .status(200)
      .json(new ApiResponse(200, "User unfollowed successfully", null));
  }

  // FOLLOW
  await User.updateOne(
    { _id: userId },
    { $addToSet: { following: user_id } }
  );

  await User.updateOne(
    { _id: user_id },
    { $addToSet: { followers: userId } }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "User followed successfully", null));
});


const getUserProfile = asyncHandler(async (req, res) => {
  const { user_id } = req.params;
  const currentUserId = req.user?._id;
  const user = await User.findById(user_id).select("-password -refreshToken");
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const isFollowing = currentUserId
    ? user.followers.some(id => id.toString() === currentUserId.toString())
    : false;

  const conversation = await Conversation.findOne({
    members: { $all: [currentUserId, user_id] }
  });
  const posts = await Post.find({ user: user_id }).sort({ createdAt: -1 });
  const conversation_id = conversation ? conversation._id : null;
  return res
    .status(200)
    .json(new ApiResponse(200, "User profile fetched successfully", { ...user.toObject(), isFollowing, conversation_id, posts }));
});

const getFollowers = asyncHandler(async (req, res) => {
  const user_id = req?.user._id;
  const user = await User.findById(user_id)
    .populate("followers", "username avatar email")
    .select("followers");

  console.log("follower user is ", user);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  console.log("user followers are ", user.followers);
  return res
    .status(200)
    .json(new ApiResponse(200, "Followers fetched successfully", user.followers));
});

export { getUser, uploadProfilePicture, getUserProfile, followUser, getFollowers };

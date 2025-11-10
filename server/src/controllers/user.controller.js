import User from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import generateAccessAndRefreshToken from "../utils/generateAccessAndRefreshToken.js";
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

import {
  uploadBufferToCloudinary,
  deleteFromCloudinary,
} from "../config/cloudinary.js";
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
    await deleteFromCloudinary(user.avatarPublicId);
  }
  const response = await uploadBufferToCloudinary(file.buffer);
  if (!response) {
    throw new ApiError(400, "Failed to change profile picture.Try again");
  }
  user.avatar = response.secure_url;
  user.avatarPublicId = response.public_id;
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

const getUserProfile = asyncHandler(async (req, res) => {
  const { user_id } = req.params;
  const user = await User.findById(user_id).select("-password -refreshToken");
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "User profile fetched successfully", user));
});
export { getUser, uploadProfilePicture, getUserProfile };

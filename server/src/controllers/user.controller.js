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
import sendNotification from "../utils/sendNotification.js";
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

const editProfile = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { payload } = req.body;
  if (!userId) {
    throw new ApiError(400, "User access denaied");
  }
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  user.username = payload.username.trim() || user.username;
  user.bio = payload.bio.trim() || user.bio;
  user.about = payload.about.trim() || user.about;
  user.skills = payload.skills;
  await user.save();
  const updatedUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  return res
    .status(200)
    .json(
      new ApiResponse(200, "Profile updated successfully", updatedUser)
    );
})

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
  await sendNotification(
    userId,              // sender
    user_id,             // receiver
    "follow",            // type
    "started following you",  // message
    {}                   // metadata (empty object)
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

  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Followers fetched successfully", user.followers));
});

const getFollowing = asyncHandler(async (req, res) => {
  const user_id = req?.user._id;
  const user = await User.findById(user_id)
    .populate("following", "username avatar email")
    .select("following");

  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return res.status(200).json(new ApiResponse(200, "Following fetched successfully", user.following));
})

const searchUser = asyncHandler(async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(200).json(new ApiResponse(200, "empty search", []));
  }
  const users = await User.aggregate([
    {
      $search: {
        index: "default", // change if your index name is different
        autocomplete: {
          query: query,
          path: "username",
          fuzzy: {
            maxEdits: 1
          }
        }
      }
    },
    { $limit: 10 },
    {
      $project: {
        username: 1,
        avatar: 1,
        _id: 1
      }
    }
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, "search results", users));
})


const addToSearchHistory = asyncHandler(async (req, res) => {
  const user_id = req.user._id;
  const { searchedUser } = req.body;
  const user = await User.findById(user_id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  user.searchHistory = user.searchHistory.filter(
    (s) => !s.userId.equals(searchedUser._id)
  );

  user.searchHistory.unshift({
    userId: searchedUser._id,
    username: searchedUser.username,
    avatar: searchedUser.avatar,
    searchedAt: new Date(),
  });

  user.searchHistory = user.searchHistory.slice(0, 10);
  await user.save();
  return res.status(200).json(new ApiResponse(200, "Search history updated successfully", null));

});


const getSearchHistory = asyncHandler(async (req, res) => {
  const user_id = req.user._id;
  const user = await User.findById(user_id).select("searchHistory");
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return res.status(200).json(new ApiResponse(200, "Search history fetched successfully", user.searchHistory));
})

const clearSearchHistory = asyncHandler(async (req, res) => {
  const user_id = req.user._id;
  const user = await User.findById(user_id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  user.searchHistory = [];
  await user.save();
  return res.status(200).json(new ApiResponse(200, "Search history cleared successfully", null));
});

const deleteSearchHistoryItem = asyncHandler(async (req, res) => {
  const user_id = req.user._id;
  const { searchHistoryId } = req.params;
  const user = await User.findById(user_id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  user.searchHistory = user.searchHistory.filter(
    (s) => !s._id.equals(searchHistoryId)
  );
  await user.save();
  return res.status(200).json(new ApiResponse(200, "Search history item deleted successfully", null));
});

const saveToken = asyncHandler(async (req, res) => {
  const user_id = req.user._id;
  const { token } = req.body;
  await User.findByIdAndUpdate(user_id, {
    $addToSet: {
      fcmTokens: token
    }
  })
  return res.status(200).json(new ApiResponse(200, "Token saved successfully", null));
});

export {
  getUser,
  uploadProfilePicture,
  getUserProfile,
  followUser,
  getFollowers,
  getFollowing,
  searchUser,
  editProfile,
  addToSearchHistory,
  getSearchHistory,
  clearSearchHistory,
  deleteSearchHistoryItem,
  saveToken
};

import Community from "../models/community.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const createCommunity = asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    console.log("Creating community with name:", name);
    // const existingCommunity = await Community.findOne({ name: name });
    // if (existingCommunity) {
    //     throw new ApiError(400, "Community with this name already exists");
    // }
    const user = req.user;
    const community = await Community.create({ name, description });
    community.members.push(user._id);
    community.admins.push(user._id);
    await community.save();
    res.status(201).json(new ApiResponse(201, "Community created successfully", community));
});

export { createCommunity };

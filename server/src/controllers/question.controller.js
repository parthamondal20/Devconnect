import Question from "../models/question.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

const createQuestion = asyncHandler(async (req, res) => {
    const { payload } = req.body;
    const { title, description, tags } = payload;
    if (!title) {
        throw new ApiError(400, "Please provide title");
    }
    const question = await Question.create({
        title,
        description,
        tags,
        user: req.user._id
    });
    return res.status(201).json(new ApiResponse(201, "Question created successfully", { ...question.toObject(), user: req.user }));
});

const getAllQuestions = asyncHandler(async (req, res) => {
    const questions = await Question.find().populate("user", "username avatar").sort({ createdAt: -1 });
    return res.status(200).json(new ApiResponse(200, "Questions fetched successfully", questions));
});

const deleteQuestion = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const question = await Question.findByIdAndDelete(id);
    return res.status(200).json(new ApiResponse(200, "Question deleted successfully", question));
});

export {
    createQuestion,
    getAllQuestions,
    deleteQuestion,
}

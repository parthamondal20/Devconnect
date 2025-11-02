import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.OPENAI_SECRET_KEY
})
const askAi = asyncHandler(async (req, res) => {
    const { query } = req.body;
    if (!query.trim()) {
        throw ApiError(400, "Please write the message");
    }
    const completion = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: `You are DevConnect Assistant, a helpful AI designed to:
          - guide users on what types of technical questions are suitable for the Q&A section
          - help explain code snippets and debug logic
          - behave like a Stack Overflow moderator, encouraging clear, specific, and reproducible questions.
          Answer professionally but in simple, developer-friendly tone.`,
            },
            {
                role: "user",
                content: query,
            },
        ],
    });
    const reply = completion.choices[0].message.content;
    return res
        .status(200)
        .json(new ApiResponse(200, "Response genetrated successfully", reply));
})

export default askAi;
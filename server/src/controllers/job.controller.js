import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import axios from "axios";
const apiKey = process.env.JOOBLE_API_KEY;
const getJobs = asyncHandler(async (req, res) => {
    const { location, role } = req.query;

    const response = await axios.post(`https://jooble.org/api/${apiKey}`,
        {
            keywords: role || "developer",  // role as keyword
            location: location || "",
        },
        {
            headers: { "Content-Type": "application/json" },
        }
    );

    const jobs = response.data.jobs;
    return res
        .status(200)
        .json(new ApiResponse(200, "Jobs fetched successfully", jobs));
});

export { getJobs };
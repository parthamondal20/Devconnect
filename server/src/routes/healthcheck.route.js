import { Router } from "express";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let version = "unknown";
try {
    const pkgPath = path.resolve(__dirname, "../../package.json");
    const pkgRaw = fs.readFileSync(pkgPath, "utf8");
    const pkg = JSON.parse(pkgRaw);
    version = pkg.version || version;
} catch (err) {
    // ignore - version stays 'unknown' when package.json cannot be read
}

const router = Router();

router.get(
    "/",
    asyncHandler(async (req, res) => {
        const uptime = process.uptime();
        const timestamp = new Date().toISOString();
        const data = { uptime, timestamp, status: "ok", version };
        return res.status(200).json(new ApiResponse(200, "Server is healthy", data));
    })
);

export default router;


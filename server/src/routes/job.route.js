import { Router } from "express";
const router = Router();
import { getJobs } from "../controllers/job.controller.js";

router.get("/list", getJobs);

export default router;

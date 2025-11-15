import { Router } from "express";
import { createCommunity } from "../controllers/Community.controller.js";
const router = Router();
// router.get("/", getCommunities);
router.post("/create", createCommunity);
export default router;
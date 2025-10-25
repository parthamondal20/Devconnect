import { Router } from "express";
import { likePost } from "../controllers/like.controller.js";
const router = Router();
router.put("/:post_id", likePost);
export default router;

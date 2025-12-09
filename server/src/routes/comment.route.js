import { Router } from "express";
import { addComment, getComments, deleteComment } from "../controllers/comment.controller.js";
const router = Router();
router.get("/:post_id", getComments);
router.post("/add", addComment);
router.delete("/:comment_id", deleteComment);
export default router;
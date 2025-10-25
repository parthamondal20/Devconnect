import { Router } from "express";
import {
  createPost,
  deletePost,
  getPosts,
} from "../controllers/post.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();
router.post("/create", upload.array("images", 10), createPost);
router.get("/all", getPosts);
router.delete("/delete/:post_id", deletePost);
export default router;

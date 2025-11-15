import { Router } from "express";
const router = Router();
import {
  getUser,
  uploadProfilePicture,
  getUserProfile,
  followUser
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
router.get("/me", getUser);
router.put("/upload-avatar", upload.single("file"), uploadProfilePicture);
router.get("/:user_id", getUserProfile);
router.post("/follow", followUser);
export default router;

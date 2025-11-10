import { Router } from "express";
const router = Router();
import {
  getUser,
  uploadProfilePicture,
  getUserProfile,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
router.get("/me", getUser);
router.put("/upload-avatar", upload.single("file"), uploadProfilePicture);
router.get("/:user_id", getUserProfile);
export default router;

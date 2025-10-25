import { Router } from "express";
const router = Router();
import {
  getUser,
  uploadProfilePicture,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
router.get("/me", getUser);
router.put("/upload-avatar", upload.single("file"), uploadProfilePicture);
export default router;

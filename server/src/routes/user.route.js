import { Router } from "express";
const router = Router();
import {
  getUser,
  uploadProfilePicture,
  getUserProfile,
  followUser,
  getFollowers,
  getFollowing,
  searchUser,
  editProfile
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
router.get("/search", searchUser);
router.get("/me", getUser);
router.get("/followers", getFollowers);
router.get("/following", getFollowing);
router.put("/profile/edit", editProfile);
router.put("/upload-avatar", upload.single("file"), uploadProfilePicture);
router.post("/follow", followUser);
router.get("/:user_id", getUserProfile);

export default router;

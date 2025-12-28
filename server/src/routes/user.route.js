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
  editProfile,
  addToSearchHistory,
  getSearchHistory,
  clearSearchHistory,
  deleteSearchHistoryItem,
  saveToken
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
router.get("/search", searchUser);
router.get("/me", getUser);
router.get("/followers", getFollowers);
router.get("/following", getFollowing);
router.put("/profile/edit", editProfile);
router.put("/upload-avatar", upload.single("file"), uploadProfilePicture);
router.post("/follow", followUser);
router.get("/profile/:user_id", getUserProfile);
router.post("/save-token", saveToken);
router.get("/search-history", getSearchHistory);
router.post("/search-history/add", addToSearchHistory);
router.delete("/search-history/clear", clearSearchHistory);
router.delete("/search-history/:searchHistoryId", deleteSearchHistoryItem);
export default router;

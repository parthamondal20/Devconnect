import { Router } from "express";
import {
  githubLogin,
  githubCallback,
  refreshAccessToken,
  logoutUser,
  sendOTP,
  verifyOTP,
  signup,
  resendOTP,
  signin,
} from "../controllers/auth.controller.js";
const router = Router();
router.get("/github", githubLogin);
router.get("/github/callback", githubCallback);
router.post("/refresh-token", refreshAccessToken);
router.post("/logout", logoutUser);
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/resend-otp", resendOTP);
export default router;

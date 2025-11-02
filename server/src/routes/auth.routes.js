import { Router } from "express";
import {
  githubCallback,
  refreshAccessToken,
  logoutUser,
  sendOTP,
  verifyOTP,
  signup,
  resendOTP,
  signin,
  googleCallback,
} from "../controllers/auth.controller.js";
import passport from "passport";
const router = Router();
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));
router.get("/github/callback", githubCallback);
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", googleCallback);
router.post("/refresh-token", refreshAccessToken);
router.post("/logout", logoutUser);
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/resend-otp", resendOTP);
export default router;

import passport from "passport";
import generateAccessAndRefreshToken from "../utils/generateAccessAndRefreshToken.js";

// GitHub OAuth callback
export const githubCallback = (req, res, next) => {
  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

  passport.authenticate(
    "github",
    { failureRedirect: "/signin" },
    async (err, user) => {
      if (err || !user) {
        console.error("GitHub login failed:", err);
        return res.redirect(`${clientUrl}/signin`);
      }

      try {
        const { accessToken, refreshToken } =
          await generateAccessAndRefreshToken(user._id);
        console.log("GitHub login successful:", user);
        console.log("Generated tokens:", accessToken);
        // Set cookie
        const options = {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          sameSite: "lax",
        };
        res
          .cookie("accessToken", accessToken, options)
          .cookie("refreshToken", refreshToken, options)
          .send(`<script>window.close()</script>`);
      } catch (error) {
        console.error("Token generation failed:", error);
        res.redirect(`${clientUrl}/signin`);
      }
    }
  )(req, res, next);
};

export const googleCallback = (req, res, next) => {
  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

  passport.authenticate(
    "google",
    {
      failureRedirect: `${clientUrl}/signin`
    },
    async (err, user) => {
      if (err || !user) {
        console.error("Google login failed:", err);
        return res.redirect(`${clientUrl}/signin`);
      }
      try {
        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
        const options = {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          sameSite: "lax",
        };
        res
          .cookie("accessToken", accessToken, options)
          .cookie("refreshToken", refreshToken, options)
          .send(`<script>window.close()</script>`);

      } catch (error) {
        console.error("Token generation failed:", error);
        res.redirect(`${clientUrl}/signin`);
      }
    }
  )(req, res, next)
};


import User from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import generateOTP from "../utils/generateOTP.js";
import sendEmail from "../utils/sendEmail.js";
import client from "../config/redis.js";
const signup = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw new ApiError(400, "User already exists");
  }
  const newUser = await User.create({
    username,
    email,
    password,
  });
  if (!newUser) {
    throw new ApiError(400, "Failed to create account! Please try again");
  }
  const { accessToken, refreshToken: newRefreshToken } =
    await generateAccessAndRefreshToken(newUser._id);

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", // ✅ REQUIRED for cross-origin cookies
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", newRefreshToken, options)
    .json(new ApiResponse(200, "Account created successfully", newUser));
});

const signin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email.trim()) {
    throw new ApiError(400, "Password not found. Enter password again");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(400, "User not found");
  }

  if (!password) {
    throw new ApiError(400, "Password not found. Enter password again");
  }
  const passwordMatched = await user.isPasswordCorrect(password);
  if (!passwordMatched) {
    throw new ApiError(400, "Incorrect password!");
  }
  const { accessToken, refreshToken: newRefreshToken } =
    await generateAccessAndRefreshToken(user._id);

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", // ✅ REQUIRED for cross-origin cookies
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", newRefreshToken, options)
    .json(new ApiResponse(200, "Account created successfully", user));
});

const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const savedOTP = await client.get(email);
  if (!savedOTP) {
    throw new ApiError(400, "OTP expired");
  }
  if (savedOTP !== otp) {
    throw new ApiError(400, "Invalid OTP");
  }
  await client.del(email);
  return res
    .status(200)
    .json(new ApiResponse(200, "OTP verified successfully"));
});

const sendOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw new ApiError(
      400,
      "Already had a account using this email ! Please login "
    );
  }
  if (!email) {
    throw new ApiError(400, "Email is missing");
  }
  const OTP = generateOTP();
  await sendEmail({
    to: email,
    subject: "Verification OTP",
    html: `Otp is <strong>${OTP}</strong>, this otp going to expire in 5 min`,
  });
  await client.setEx(email, 300, OTP);
  return res.status(200).json(new ApiResponse(200, "OTP is sent successfully"));
});

const resendOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new ApiError(400, "Email not found! Try again!");
  }
  await client.del(email);
  const OTP = generateOTP();
  await sendEmail({
    to: email,
    subject: "Verification OTP",
    html: `Otp is <strong>${OTP}</strong>, this otp going to expire in 5 min`,
  });
  await client.setEx(email, 300, OTP);
  return res.status(200).json(new ApiResponse(200, "OTP resent successfully"));
});

import jwt from "jsonwebtoken";
const refreshAccessToken = asyncHandler(async (req, res) => {
  console.log("Request coming here");
  const incomingRefreshToken =
    req?.cookies?.refreshToken || req?.body?.refreshToken;

  console.log("The incoming refresh token is ", incomingRefreshToken);
  if (!incomingRefreshToken) {
    throw new ApiError(400, "Invalid refresh token");
  }
  const decodedToken = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );
  const user = await User.findById(decodedToken._id);
  if (!user) {
    throw new ApiError(400, "Invalid refresh token!");
  }

  if (user.refreshToken !== incomingRefreshToken) {
    throw new ApiError(403, "Refresh token is not matched !");
  }

  const { accessToken, refreshToken: newRefreshToken } =
    await generateAccessAndRefreshToken(user._id);

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", // ✅ REQUIRED for cross-origin cookies
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", newRefreshToken, options)
    .json(new ApiResponse(200, "Refresh token is regenerated successfully"));
});

const logoutUser = asyncHandler(async (req, res) => {
  const { user_id } = req.body;
  await User.findByIdAndUpdate(
    user_id,
    {
      $set: {
        refreshToken: null,
      },
    },
    {
      new: true,
    }
  );
  return res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(new ApiResponse(200, "Logged out successfully"));
});
export {
  refreshAccessToken,
  logoutUser,
  sendOTP,
  verifyOTP,
  signup,
  signin,
  resendOTP,
};

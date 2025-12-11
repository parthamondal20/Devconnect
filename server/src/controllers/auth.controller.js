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
        // Set cookie
        const options = {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
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
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
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
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    // ✅ REQUIRED for cross-origin cookies
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
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // ✅ REQUIRED for cross-origin cookies
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

  console.log("=== OTP Verification Debug ===");
  console.log("Email:", email);
  console.log("Received OTP:", otp, "Type:", typeof otp);

  const savedOTP = await client.get(email);
  console.log("Saved OTP from Redis:", savedOTP, "Type:", typeof savedOTP);

  if (!savedOTP) {
    console.log("❌ OTP not found in Redis (expired or never sent)");
    throw new ApiError(400, "OTP expired or not found");
  }

  // Convert both to strings and trim whitespace
  const receivedOTP = String(otp).trim();
  const storedOTP = String(savedOTP).trim();

  console.log("After conversion - Received:", receivedOTP, "Stored:", storedOTP);
  console.log("Match:", receivedOTP === storedOTP);

  if (storedOTP !== receivedOTP) {
    console.log("❌ OTP mismatch!");
    throw new ApiError(400, "Invalid OTP");
  }

  console.log("✅ OTP verified successfully");
  await client.del(email);

  return res
    .status(200)
    .json(new ApiResponse(200, "OTP verified successfully"));
});

const sendOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  // Check if user already exists
  const user = await User.findOne({ email });
  if (user) {
    throw new ApiError(
      400,
      "An account with this email already exists. Please sign in instead."
    );
  }

  try {
    const OTP = generateOTP();
    console.log(`Generated OTP for ${email}: ${OTP}`); // For debugging in development

    await sendEmail({
      to: email,
      subject: "DevConnect - Email Verification",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">Welcome to DevConnect!</h2>
          <p>Your verification code is:</p>
          <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <h1 style="color: #4F46E5; margin: 0; font-size: 32px; letter-spacing: 8px;">${OTP}</h1>
          </div>
          <p style="color: #6b7280;">This code will expire in <strong>5 minutes</strong>.</p>
          <p style="color: #6b7280; font-size: 12px; margin-top: 20px;">
            If you didn't request this code, please ignore this email.
          </p>
        </div>
      `,
    });

    await client.setex(email, 300, OTP);
    console.log(`OTP stored in Redis for ${email}`);

    return res.status(200).json(new ApiResponse(200, "OTP sent successfully to your email"));
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw new ApiError(500, `Failed to send OTP: ${error.message}`);
  }
});

const resendOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  try {
    // Delete old OTP if exists
    await client.del(email);

    const OTP = generateOTP();
    console.log(`Resending OTP for ${email}: ${OTP}`); // For debugging in development

    await sendEmail({
      to: email,
      subject: "DevConnect - New Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">DevConnect Verification</h2>
          <p>You requested a new verification code:</p>
          <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <h1 style="color: #4F46E5; margin: 0; font-size: 32px; letter-spacing: 8px;">${OTP}</h1>
          </div>
          <p style="color: #6b7280;">This code will expire in <strong>5 minutes</strong>.</p>
          <p style="color: #6b7280; font-size: 12px; margin-top: 20px;">
            If you didn't request this code, please ignore this email.
          </p>
        </div>
      `,
    });

    await client.setex(email, 300, OTP);
    console.log(`New OTP stored in Redis for ${email}`);

    return res.status(200).json(new ApiResponse(200, "New OTP sent successfully"));
  } catch (error) {
    console.error("Error resending OTP:", error);
    throw new ApiError(500, `Failed to resend OTP: ${error.message}`);
  }
});

import jwt from "jsonwebtoken";
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req?.cookies?.refreshToken || req?.body?.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Refresh token missing"); // ✅ Use 401
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken._id);
    if (!user) {
      throw new ApiError(401, "Invalid refresh token!"); // ✅ Use 401
    }

    if (user.refreshToken !== incomingRefreshToken) {
      throw new ApiError(401, "Refresh token is not matched!"); // ✅ Use 401
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(new ApiResponse(200, "Refresh token is regenerated successfully"));

  } catch (error) {
    // ✅ Handle JWT-specific errors
    if (error.name === "TokenExpiredError") {
      throw new ApiError(401, "Refresh token expired");
    }
    if (error.name === "JsonWebTokenError") {
      throw new ApiError(401, "Invalid refresh token");
    }
    throw error; // Re-throw other errors
  }
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

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
import session from "express-session";
import passport from "passport";

app.use(
  session({
    secret: "devconnect-secret",
    resave: false,
    saveUninitialized: true,
  })
);
import "./config/passport.js";
app.use(passport.initialize());
app.use(passport.session());
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.routes.js";
import likeRoutes from "./routes/like.route.js";
import commentRoutes from "./routes/comment.route.js";
import chatbotRoutes from "./routes/chatbot.route.js";
import authenticateUser from "./middlewares/authenticate.middleware.js";
import jobRoutes from "./routes/job.route.js";
import communityRoutes from "./routes/community.routes.js";
import healthcheckRoute from "./routes/healthcheck.route.js";
app.use("/api/healthcheck", healthcheckRoute);
app.use("/api/auth", authRoutes);
app.use(authenticateUser);
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/like", likeRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/jobs", jobRoutes);
import errorHandler from "./middlewares/error.middleware.js";
app.use(errorHandler);
export default app;

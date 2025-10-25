import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import User from "../models/user.model.js";
import dotenv from "dotenv";
import crypto from "crypto";
dotenv.config();
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ githubId: profile.id });

        if (!user) {
          const randomPassword = crypto.randomBytes(16).toString("hex");
          // Create user if doesn't exist
          user = await User.create({
            githubId: profile.id,
            username: profile.username || profile.displayName || "GitHubUser",
            email:
              profile.emails?.[0]?.value || `noemail-${profile.id}@github.com`,
            avatar: profile.photos?.[0]?.value || "",
            password: randomPassword,
            verified: true,
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Serialize / deserialize
passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

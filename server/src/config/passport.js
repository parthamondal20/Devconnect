import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
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

        if (!user && profile.emails?.[0]?.value) {
          user = await User.findOne({ email: profile.emails[0].value });
        }
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
        } else if (!user.githubId || !user.githubUsername) {
          user.githubId = profile.id;
          user.githubUsername = profile.username;
          await user.save();
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// google signup

passport.use(
  new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
  },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user && profile.emails?.[0]?.value) {
          user = await User.findOne({ email: profile.emails[0].value });
        }
        if (!user) {
          const randomPassword = crypto.randomBytes(16).toString("hex");
          user = await User.create({
            googleId: profile.id,
            username: profile.username || profile.displayName || "GoogleUser",
            email:
              profile.emails?.[0]?.value || `noemail-${profile.id}@google.com`,
            avatar: profile.photos?.[0]?.value || "",
            password: randomPassword,
            verified: true,
          })
        } else if (!user.googleId) {
          user.googleId = profile.id;
          await user.save();
        }
        return done(null, user);
      } catch (error) {
        return done(err, null);
      }
    }
  )
)
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

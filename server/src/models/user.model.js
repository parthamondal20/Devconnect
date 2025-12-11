import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    about: {
      type: String,
    },
    avatar: {
      type: String,
      default: "https://avatars.githubusercontent.com/u/1?v=4",
    },
    avatarPublicId: {
      type: String, // store Cloudinary public_id for deletion or replacement
      default: null,
    },
    bio: {
      type: String,
      maxlength: 300,
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    portfollioLink: {
      type: String,
      default: null
    },
    links: {
      type: String,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    githubId: {
      type: String,
      default: null
    },
    githubUsername: {
      type: String,
      default: null
    },
    googleId: {
      type: String,
      default: null
    },
    refreshToken: {
      type: String,
      default: null
    },
    searchHistory: [{
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      username: String,
      avatar: String,
      searchedAt: { type: Date, default: Date.now },
    }
    ],
  },
  {
    timestamps: true,
  }
);
userSchema.index({ username: 1 });
userSchema.index({ email: 1 }, { unique: true });
import jwt from "jsonwebtoken";
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIREY }
  );
};
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIREY }
  );
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
userSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.password;
    delete ret.refreshToken;
    return ret;
  },
});
userSchema.methods.isPasswordCorrect = async function (password) {
  return bcrypt.compare(password, this.password);
};
const User = mongoose.model("User", userSchema);
export default User;

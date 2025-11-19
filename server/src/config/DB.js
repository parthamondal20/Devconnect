import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
mongoose.set("autoIndex", true);
const connectDB = async () => {
  try {
    const connecttion = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${connecttion.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;

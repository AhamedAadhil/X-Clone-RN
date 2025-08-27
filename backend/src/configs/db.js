import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(ENV.DATABASE_URL);
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed", error.message);
    process.exit(1);
  }
};

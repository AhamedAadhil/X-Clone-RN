import mongoose, { Mongoose } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    clerkId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    userName: { type: String, required: true, unique: true },
    profilePicture: { type: String, default: "" },
    bannerImage: { type: String, default: "" },
    bio: { type: String, default: "", maxlength: 160 },
    location: { type: String, default: "" },
    followers: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    following: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;

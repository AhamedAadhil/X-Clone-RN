import expressAsyncHandler from "express-async-handler";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { getAuth } from "@clerk/express";
import cloudinary from "../configs/cloudinary.js";

export const getPosts = expressAsyncHandler(async (req, res) => {
  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .populate("user", "username firstName lastName profilePicture")
    .populate({
      path: "comments",
      populate: {
        path: "user",
        select: "username firstName lastName profilePicture",
      },
    });

  res.status(200).json({ posts, success: true });
});

export const getPost = expressAsyncHandler(async (req, res) => {
  const { postId } = req.params;
  const post = await Post.findById(postId)
    .populate("user", "username firstName lastName profilePicture")
    .populate({
      path: "comments",
      populate: {
        path: "user",
        select: "username firstName lastName profilePicture",
      },
    });
  if (!post) {
    return res.status(404).json({ message: "Post not found", success: false });
  }
  res.status(200).json({ post, success: true });
});

export const getUserPosts = expressAsyncHandler(async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(404).json({ message: "User not found", success: false });
  }

  const posts = await Post.find({ user: user._id })
    .sort({ createdAt: -1 })
    .populate("user", "username firstName lastName profilePicture")
    .populate({
      path: "comments",
      populate: {
        path: "user",
        select: "username firstName lastName profilePicture",
      },
    });
  res.status(200).json({ posts, success: true });
});

export const createPost = expressAsyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const { content } = req.body;
  const imageFile = req.file;

  if (!content && !imageFile) {
    return res
      .status(400)
      .json({ message: "Post content or image is required", success: false });
  }

  const user = await User.findOne({ clerkId: userId });
  if (!user) {
    return res.status(404).json({ message: "User not found", success: false });
  }

  let imageUrl = "";
  if (imageFile) {
    try {
      // convert buffer to base64 string to cloudinary
      const base64Image = `data:${
        imageFile.mimetype
      };base64,${imageFile.buffer.toString("base64")}`;
      //   upload image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(base64Image, {
        folder: "xclone/posts",
        resource_type: "image",
        transformation: [
          { width: 800, height: 600, crop: "limit" },
          { quality: "auto" },
          { format: "auto" },
        ],
      });
      imageUrl = uploadResponse.secure_url;
    } catch (uploadError) {
      return res.status(400).json({
        message: "Image upload failed",
        error: uploadError,
        success: false,
      });
    }
  }

  const post = await Post.create({
    content: content || "",
    image: imageUrl,
    user: user._id,
  });

  return res.status(201).json({ post, success: true });
});

export const likePost = expressAsyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const { postId } = req.params;
  const user = await User.findOne({ clerkId: userId });
  if (!user) {
    return res.status(404).json({ message: "User not found", success: false });
  }

  const post = await Post.findById(postId);
  if (!post) {
    return res.status(404).json({ message: "Post not found", success: false });
  }

  const isLiked = post.likes.includes(user._id);
  if (isLiked) {
    post.likes.pull(user._id);
  } else {
    post.likes.push(user._id);
  }

  await post.save();

  // send notification to post owner if not liked own post
  if (post.user.toString() !== user._id.toString()) {
    await Notification.create({
      from: user._id,
      to: post.user,
      type: "like",
      post: postId,
    });
  }

  return res.status(200).json({
    post,
    success: true,
    messae: isLiked ? "Post unliked" : "Post liked",
  });
});

export const deletePost = expressAsyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const { postId } = req.params;

  const user = await User.findOne({ clerkId: userId });
  const post = await Post.findById(postId);

  if (!user || !post) {
    return res
      .status(404)
      .json({ message: "User or Post not found", success: false });
  }

  if (post.user.toString() !== user._id.toString()) {
    return res
      .status(403)
      .json({
        message: "You are not authorized to delete this post",
        success: false,
      });
  }

  //  delete all comments related to this post
  await Comment.deleteMany({ post: post._id });

  // delete all notifications related to this post
  await Notification.deleteMany({ post: post._id });

  // delete image from cloudinary if exists
  if (post.image) {
    const publicId = post.image.split("/").pop().split(".")[0]; // extract public id from url
    await cloudinary.uploader.destroy(`xclone/posts/${publicId}`, {
      resource_type: "image",
    });
  }

  // delete the post
  await Post.findByIdAndDelete(postId);

  return res
    .status(200)
    .json({ message: "Post deleted successfully", success: true });
});

import asyncHandler from "express-async-handler";
import { getAuth } from "@clerk/express";
import Comment from "../models/comment.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";

export const getComments = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  const comments = await Comment.find({ post: postId })
    .sort({ createdAt: -1 })
    .populate("user", "username firstName lastName profilePicture");
  res.status(200).json({ comments, success: true });
});

export const createComment = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { userId } = getAuth(req);
  const { content } = req.body;

  if (!content || content.trim() === "") {
    res.status(400);
    throw new Error("Comment content cannot be empty");
  }

  const user = await User.findOne({ clerkId: userId });
  const post = await Post.findById(postId);
  if (!user || !post) {
    return res
      .status(404)
      .json({ message: "User or Post not found", success: false });
  }

  const comment = await Comment.create({
    content,
    user: user._id,
    post: postId,
  });

  // link the comment to the post
  await Post.findByIdAndUpdate(postId, { $inc: { comments: comment._id } });

  //   create a notification for the post owner
  if (post.user.toString() !== user._id.toString()) {
    await Notification.create({
      from: user._id,
      to: post.user,
      type: "comment",
      post: postId,
      comment: comment._id,
    });
  }

  res.status(201).json({ comment, success: true });
});

export const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { userId } = getAuth(req);

  const user = await User.findOne({
    clerkId: userId,
  });
  const comment = await Comment.findById(commentId);

  if (!user || !comment) {
    return res
      .status(404)
      .json({ message: "User or Comment not found", success: false });
  }

  if (comment.user.toString() !== user._id.toString()) {
    return res
      .status(403)
      .json({
        message: "You are not authorized to delete this comment",
        success: false,
      });
  }

  // remove comment from the post
  await Post.findByIdAndUpdate(comment.post, {
    $pull: { comments: comment._id },
  });

  // delete the comment
  await Comment.findOneAndDelete(commentId);

  res
    .status(200)
    .json({ message: "Comment deleted successfully", success: true });
});

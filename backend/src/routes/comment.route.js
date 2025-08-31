import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";

import {
  getComments,
  createComment,
  deleteComment,
} from "../controllers/comment.controller.js";

const router = express.Router();

// public routes
router.get("/post/:postId", getComments);

// private routes
router.post("/post/:postId", protectRoute, createComment);
router.delete("/:commentId", protectRoute, deleteComment);

export default router;

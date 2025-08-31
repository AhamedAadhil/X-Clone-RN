import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import { ENV } from "./configs/env.js";
import { connectDB } from "./configs/db.js";

import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import commentRoutes from "./routes/comment.route.js";
import notificationRoutes from "./routes/notification.route.js";
import { arcjetMiddleware } from "./middlewares/arcjet.middleware.js";

const PORT = ENV.PORT || 3000;

const app = express();

// Database connection
await connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());
app.use(arcjetMiddleware);

// Routes
app.get("/api/users", userRoutes);
app.get("/api/posts", postRoutes);
app.get("/api/comments", commentRoutes);
app.get("/api/notifications", notificationRoutes);

// error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res
    .status(500)
    .json({ error: err.message || "Internal Server Error", success: false });
});

// listed for local development
if (ENV.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// export for vercel
export default app;

import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import { ENV } from "./configs/env.js";
import { connectDB } from "./configs/db.js";

import userRoutes from "./routes/user.route.js";

const PORT = ENV.PORT || 3000;

const app = express();

// Database connection
await connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

// Routes
app.get("/api/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

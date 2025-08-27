import express from "express";
import { ENV } from "./configs/env.js";
import { connectDB } from "./configs/db.js";

await connectDB();

const app = express();
const PORT = ENV.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

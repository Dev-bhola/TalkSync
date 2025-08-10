import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import cors from "cors";
import { connectDB } from "./lib/db.js";
import { app, server } from "./lib/socket.js";
import path from "path";

dotenv.config();
const __dirname = path.resolve();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// API routes
app.get("/", (req, res) => {
  res.send("Hello World");
});
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Static file serving for production
if (process.env.NODE_ENV === "production") {
  const staticPath = path.join(__dirname, "dist");
  app.use(express.static(staticPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });
}

// Start server
server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
  connectDB();
});

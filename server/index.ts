import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./db";
import { handleDemo } from "./routes/demo";
import { handleLogin, handleSignup, handleGoogleLogin } from "./routes/auth";
import { saveAnalysis, getUserHistory } from "./routes/analysis";

export async function createServer() {
  await connectDB();

  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Auth routes
  app.post("/api/auth/login", handleLogin);
  app.post("/api/auth/signup", handleSignup);
  app.post("/api/auth/google", handleGoogleLogin);

  // Analysis routes
  app.post("/api/analysis/save", saveAnalysis);
  app.get("/api/analysis/history/:userId", getUserHistory);

  return app;
}

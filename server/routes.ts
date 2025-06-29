import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoint to provide configuration to client
  app.get("/api/config", (req, res) => {
    res.json({
      openaiApiKey: process.env.OPENAI_API_KEY || "",
      geminiApiKey: process.env.GEMINI_API_KEY || "",
    });
  });

  const httpServer = createServer(app);

  return httpServer;
}

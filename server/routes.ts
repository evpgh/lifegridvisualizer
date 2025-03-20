import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // No specific backend routes needed for this app
  // as everything is handled client-side

  const httpServer = createServer(app);

  return httpServer;
}

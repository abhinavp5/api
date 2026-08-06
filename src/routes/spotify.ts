import { handleLogin, handleCallback } from "../controllers/spotify.controller";
import { Router } from "express";
import type { Request, Response } from "express";
export const spotifyRouter: Router = Router();

spotifyRouter.get("/", (req: Request, res: Response) => {
  res.json({
    name: "Spotify Endpoints",
    endpoints: ["/login", "/callback"],
  });
});

spotifyRouter.get("/login", handleLogin);
spotifyRouter.get("/callback", handleCallback);
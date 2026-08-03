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
spotifyRouter.get("/token-check", (req: Request, res: Response) => {
  const cookie_acces_token = req.cookies.spotify_access_token;
  console.log(cookie_acces_token);
  res.json({
    hasToken: Boolean(cookie_acces_token),
  });
});

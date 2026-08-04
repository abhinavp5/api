import { Router } from "express";
import { getTopSongs } from "../controllers/music.controller";
export const musicRouter = Router();

musicRouter.get("/topSongs", getTopSongs);

import type { Request, Response } from "express";
import { Router } from "express";
import {getTopSongs, getTopArtists} from "../controllers/music.controller"
export const musicRouter = Router();

{
  /*Profile*/
}
musicRouter.get("/topSongs", getTopSongs);
musicRouter.get("/topArtists", getTopArtists);
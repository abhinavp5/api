import type { Request, Response } from "express";
import {Router} from 'express';
import { profileRouter } from "./profile.routes";
import { musicRouter } from "./music.routes";
import { fitnessRouter } from "./fitness.routes";
import { spotifyRouter } from "./spotify";

export const apiRouter: Router = Router();

apiRouter.get('/', (req: Request, res: Response) => {
  res.json({
    name: 'Personal API',
    endpoints: ['/profile', '/music', '/fitness', '/spotify'],
  });
});

apiRouter.use('/profile', profileRouter);
apiRouter.use('/music', musicRouter);
apiRouter.use('/fitness',fitnessRouter);
apiRouter.use('/spotify',spotifyRouter);

import type { Request, Response } from "express";
import {Router} from 'express';
import { profileRouter } from "./profile.routes";
import { musicRouter } from "./music.routes";
import { fitnessRouter } from "./fitness.routes";

export const apiRouter = Router();

apiRouter.use('/profile', profileRouter);
apiRouter.use('/music', musicRouter);
apiRouter.use('/fitness',fitnessRouter);
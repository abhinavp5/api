import type {Request, Response } from 'express';
import {Router} from 'express';

export const profileRouter = Router();

{
  /*Profile*/
}
profileRouter.get("/about", (req: Request, res: Response) => {});
profileRouter.get("/courses", (req: Request, res: Response) => {});
profileRouter.get("/contact", (req: Request, res: Response) => {});
profileRouter.get("/experience", (req: Request, res: Response) => {});

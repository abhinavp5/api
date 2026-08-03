import type {Request, Response } from 'express';
import {Router} from 'express';
import { getMostRecent, getNmostRecent } from '../controllers/blog.controller';

export const blogRouter= Router();

{
  /*Blog*/
}
blogRouter.get("/mostRecent", getMostRecent);
blogRouter.get("/NmostRecent", getNmostRecent);

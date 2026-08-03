import type {Request, Response } from 'express';
import {Router} from 'express';
import{
  getAbout,
  getCourses,
  getContact,
  getExperience
} from '../controllers/profile.controller';
export const profileRouter = Router();

{
  /*Profile*/
}
profileRouter.get("/about",getAbout);
profileRouter.get("/courses", getCourses);
profileRouter.get("/contact", getContact);
profileRouter.get("/experience", getExperience);

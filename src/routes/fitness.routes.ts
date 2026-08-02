import type { Request, Response } from "express";
import { Router } from "express";
import {getMileage, getTotalWeight} from "../controllers/profile.controller";
export const fitnessRouter: Router = Router();

{
  /*Fitness*/
}
fitnessRouter.get("mileage", getMileage);
fitnessRouter.get("totalWeight", getTotalWeight);

import express, { type Express } from "express";
import cors, { type CorsOptions } from "cors";
import { apiRouter } from "./src/routes";
import cookieParser from "cookie-parser";
import { initDatabase } from "./src/db/database";

const app: Express = express();
const isProduction = process.env.NODE_ENV === "production";
const allowedOrigin = isProduction
  ? process.env.PROD_FRONTEND_URL
  : process.env.DEV_FRONTEND_URL;

const corsOptions = {
  origin: allowedOrigin,
  methods: ["GET"],
  credentials: true,
};

app.use(cookieParser());
app.use("/", cors(corsOptions), apiRouter);
initDatabase();

app.listen(3000, () => {
  console.log("Server is running");
});

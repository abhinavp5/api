import express, { type Express } from "express";
import cors, { type CorsOptions } from "cors";
import { apiRouter } from "./src/routes";
import { initDatabase } from "./src/db/database";
import { syncNewMusic } from "./src/services/spotify.services";

const app: Express = express();

const allowedOrigins = [
  process.env.PROD_FRONTEND_URL,
  process.env.DEV_FRONTEND_URL,
  "http://127.0.0.1:5173",
  "http://localhost:5173",
].filter((origin): origin is string => Boolean(origin));

const corsOptions: CorsOptions = {
  origin: allowedOrigins,
  methods: ["GET"],
  credentials: true,
};

app.use("/", cors(corsOptions), apiRouter);
initDatabase();
syncNewMusic.start();

app.listen(3000, () => {
  console.log("Server is running");
});

import express, { type Express } from "express";
import { apiRouter } from "./src/routes";
import cookieParser from "cookie-parser";
import { initDatabase } from "./src/db/database";

const app: Express = express();

app.use(cookieParser());
app.use("/", apiRouter);
initDatabase();

app.listen(3000, () => {
  console.log("Server is running");
});

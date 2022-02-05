import { default as express, Request, Response } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";

import apiRouter from "./routes/api/api-router";

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/v1", apiRouter);
app.get("/ping", (req: Request, res: Response) => {
    res.send("ping");
});

module.exports = app;

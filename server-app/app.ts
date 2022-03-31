import { default as express, NextFunction, Request, Response } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";

import apiRouter from "./controllers/api-router";
import { CustomError } from "./types/errors/custom-error";
import { ServerError } from "./types/errors/server-error";

const handleError = (
    err: Error | CustomError,
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    console.log(err);

    if (!(err instanceof CustomError)) {
        err = new ServerError(err.message);
    }

    res.status(err.getCode()).json(err.getMessage());
};

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "..", "web-app", "build")));

app.use("/api/v1", apiRouter);
app.get("/ping", (req: Request, res: Response) => {
    res.send("pong");
});
app.use(handleError);

module.exports = app;

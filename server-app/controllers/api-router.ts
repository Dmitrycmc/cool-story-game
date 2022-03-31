import express, { Request, Response } from "express";
import roomController from "./rooms-controller";
import questionsController from "./questions-controller";

const apiRouter = express.Router();

apiRouter.use("/room", roomController);
apiRouter.use("/questions", questionsController);
apiRouter.get("/version", (req: Request, res: Response) => {
    res.send(require('../../package.json').version);
});

export default apiRouter;

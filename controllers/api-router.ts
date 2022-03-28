import express from "express";
import roomController from "./rooms-controller";
import questionsController from "./questions-controller";

const apiRouter = express.Router();

apiRouter.use("/room", roomController);
apiRouter.use("/questions", questionsController);

export default apiRouter;

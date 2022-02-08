import express from "express";
import roomRouter from "./room/room-router";
import questionsRouter from "./questions/questions-router";

const apiRouter = express.Router();

apiRouter.use("/room", roomRouter);
apiRouter.use("/questions", questionsRouter);

export default apiRouter;

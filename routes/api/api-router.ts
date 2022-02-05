import express from "express";
import roomRouter from "./room/room-router";

const apiRouter = express.Router();

apiRouter.use("/room", roomRouter);

export default apiRouter;

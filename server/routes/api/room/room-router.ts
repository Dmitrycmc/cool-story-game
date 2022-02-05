import express from "express";
import { createRoom, register, start, giveAnswer, getStatus } from "../../../services/room-service";

const router = express.Router();

router.post("/new", async (req, res, next) => {
    createRoom()
        .then((data) => res.json(data))
        .catch(next);
});

router.post("/:roomId/register", async (req, res, next) => {
    const name = req.body.name;
    const roomId = req.params.roomId;

    register({ roomId, name })
        .then((data) => res.json(data))
        .catch(next);
});

router.post("/:roomId/start", async (req, res, next) => {
    const token = req.body.token;
    const roomId = req.params.roomId;

    start({ roomId, token })
        .then((data) => res.json(data))
        .catch(next);
});

router.post("/:roomId/status", async (req, res, next) => {
    const { playerId, token } = req.body;
    const roomId = req.params.roomId;

    getStatus({ roomId, playerId, token })
        .then((data) => res.json(data))
        .catch(next);
});

router.post("/:roomId/answer", async (req, res, next) => {
    const { playerId, token, answer } = req.body;
    const roomId = req.params.roomId;
    console.log(answer);
    giveAnswer({ roomId, playerId, token, answer })
        .then((data) => res.json(data))
        .catch(next);
});

export default router;

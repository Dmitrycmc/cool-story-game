import express from "express";
import * as roomService from "../../services/room-service";
import { HOUR } from "../../utils/time";
import { broadcast } from "../../websocket";

const router = express.Router();

router.post("/new", async (req, res, next) => {
    roomService
        .createRoom()
        .then(({ token, ...room }) => {
            res.cookie(`room:${room.id}`, token, { maxAge: HOUR }).json(room);
        })
        .catch(next);
});

router.post("/:roomId/register", async (req, res, next) => {
    const name = req.body.name;
    const roomId = req.params.roomId;

    roomService
        .register({ roomId, name })
        .then(({ token, ...player }) => {
            res.cookie(`player:${roomId}`, token, { maxAge: HOUR }).json(player);
            broadcast(roomId, { type: 'NEW_PLAYER', name });
        })
        .catch(next);
});

router.post("/:roomId/start", async (req, res, next) => {
    const token = req.body.token;
    const roomId = req.params.roomId;

    roomService
        .start({ roomId, token })
        .then((data) => res.json(data))
        .catch(next);
});

router.post("/:roomId/status", async (req, res, next) => {
    const { playerId, token } = req.body;
    const roomId = req.params.roomId;

    roomService
        .getStatus({ roomId, playerId, token })
        .then((data) => res.json(data))
        .catch(next);
});

router.post("/:roomId/answer", async (req, res, next) => {
    const { playerId, token, answer } = req.body;
    const roomId = req.params.roomId;

    roomService
        .giveAnswer({ roomId, playerId, token, answer })
        .then((data) => res.json(data))
        .catch(next);
});

router.post("/:roomId/story", async (req, res, next) => {
    const { playerId, token } = req.body;
    const roomId = req.params.roomId;

    roomService
        .getStory({ roomId, playerId, token })
        .then((data) => res.json(data))
        .catch(next);
});

export default router;

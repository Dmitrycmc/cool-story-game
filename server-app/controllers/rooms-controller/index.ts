import express from "express";
import * as roomService from "../../services/room-service";
import { DAY } from "../../utils/time";
import { broadcast } from "../../websocket";

const router = express.Router();

router.post("/new", async (req, res, next) => {
    roomService
        .createRoom()
        .then(({ token, ...room }) => {
            res.cookie(`room-token:${room.id}`, token, { maxAge: DAY }).json(room);
        })
        .catch(next);
});

router.post("/:roomId/register", async (req, res, next) => {
    const name = req.body.name;
    const roomId = req.params.roomId;

    roomService
        .register({ roomId, name })
        .then(({ token, ...player }) => {
            broadcast(roomId, { type: 'NEW_PLAYER', payload: player });
            res.cookie(`player-id:${roomId}`, player.id, { maxAge: DAY })
                .cookie(`player-token:${player.id}`, token, { maxAge: DAY })
                .json(player);
        })
        .catch(next);
});

router.post("/:roomId/start", async (req, res, next) => {
    const roomId = req.params.roomId;
    const token = req.cookies[`room-token:${roomId}`] || req.body.token;

    roomService
        .start({ roomId, token })
        .then((data) => {
            broadcast(roomId, { type: 'START' });
            res.json(data);
        })
        .catch(next);
});

router.post("/:roomId/status", async (req, res, next) => {
    const roomId = req.params.roomId;

    const playerId = req.cookies[`player-id:${roomId}`] || req.body.playerId;
    const token = req.cookies[`player-token:${playerId}`] || req.body.token;

    roomService
        .getStatus({ roomId, playerId, token })
        .then((data) => res.json(data))
        .catch(next);
});

router.post("/:roomId/answer", async (req, res, next) => {
    const { answer } = req.body;
    const roomId = req.params.roomId;

    const playerId = req.cookies[`player-id:${roomId}`] || req.body.playerId;
    const token = req.cookies[`player-token:${playerId}`] || req.body.token;

    roomService
        .giveAnswer({ roomId, playerId, token, answer })
        .then((room) => {
            broadcast(roomId, {
                type: 'TURN',
                payload: room,
            });
            res.json(room);
        })
        .catch(next);
});

router.post("/:roomId/story", async (req, res, next) => {
    const roomId = req.params.roomId;

    const playerId = req.cookies[`player-id:${roomId}`] || req.body.playerId;
    const token = req.cookies[`player-token:${playerId}`] || req.body.token;

    roomService
        .getStory({ roomId, playerId, token })
        .then((data) => res.json(data))
        .catch(next);
});

router.post("/:roomId/publish", async (req, res, next) => {
    const roomId = req.params.roomId;

    const playerId = req.cookies[`player-id:${roomId}`] || req.body.playerId;
    const token = req.cookies[`player-token:${playerId}`] || req.body.token;

    roomService
        .publishStory({ roomId, playerId, token })
        .then((room) => {
            broadcast(roomId, {
                type: 'TURN',
                payload: room,
            });
            res.json(room);
        })
        .catch(next);
});

export default router;

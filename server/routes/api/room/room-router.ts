import express from "express";
import { roomService } from "../../../service/room-service";

const router = express.Router();

router.post("/new", async (req, res, next) => {
    roomService
        .createRoom()
        .then((data) => res.json(data))
        .catch(next);
});

router.post("/:roomId/register", async (req, res, next) => {
    const name = req.body.name;
    const roomId = req.params.roomId;

    roomService
        .register({ roomId, name })
        .then((data) => res.json(data))
        .catch(next);
});

router.post("/:roomId/start", async (req, res, next) => {
    const token = req.body.token;
    const roomId = req.params.roomId;

    roomService
        .start({ roomId, token })
        .then(() => res.end())
        .catch(next);
});

export default router;

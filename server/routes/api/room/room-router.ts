import express from "express";
import { roomService } from "../../../service/room-service";

const router = express.Router();

router.post("/new", async (req, res) => {
    res.json(await roomService.createRoom());
});

router.post("/:roomId/register", async (req, res) => {
    const name = req.body.name;
    const roomId = req.params.roomId;

    res.json(await roomService.register({ roomId, name }));
});

export default router;

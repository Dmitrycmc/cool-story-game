import express from "express";
import { roomDto } from "../../../dto/room";

const router = express.Router();

router.get("/new", async (req, res) => {
    res.json(await roomDto.create());
});

export default router;

import { roomDto } from "../dto/room";
import { Status } from "../types/status";
import { playerDto } from "../dto/player";
import { BadRequest } from "../types/errors/bad-request";

import { generate } from "rand-token";
import { Room } from "../types/room";
import { Player } from "../types/player";
import { Forbidden } from "../types/errors/forbidden";

export const roomService = {
    createRoom: async (): Promise<Room> => {
        const token = generate(6);
        const roomId = await roomDto.insertOne({
            status: Status.REGISTRATION,
            token,
            playersNumber: 0,
        });

        const createdRoom = await roomDto.findById(roomId);

        if (createdRoom === null) {
            throw new Error("Room was not created");
        }

        return createdRoom;
    },

    register: async ({ roomId, name }: { roomId: string; name: string }): Promise<Player> => {
        const room = await roomDto.findById(roomId);
        const player = await playerDto.findOne({
            name,
            roomId: roomId,
        });

        if (room === null) {
            throw new BadRequest("Invalid room: not found");
        }
        if (room.status !== Status.REGISTRATION) {
            throw new BadRequest("Invalid room: the game has already started");
        }
        if (player) {
            throw new BadRequest(`Invalid name: ${name} already registered`);
        }

        const createdPlayerId = await playerDto.insertOne({
            name,
            token: generate(6),
            roomId: roomId,
        });

        await roomDto.updateById(roomId, { $inc: { playersNumber: 1 } });

        const createdPlayer = await playerDto.findById(createdPlayerId);

        if (createdPlayer === null) {
            throw new Error("Player was not created");
        }

        return createdPlayer;
    },

    start: async ({ roomId, token }: { roomId: string; token: string }): Promise<void> => {
        const room = await roomDto.findById(roomId);

        if (room === null) {
            throw new BadRequest("Invalid room: not found");
        }
        if (room.token !== token) {
            throw new Forbidden("Invalid token");
        }
        if (room.status !== Status.REGISTRATION) {
            throw new BadRequest("Invalid room: the game has already started");
        }
        if (room.playersNumber < 2) {
            throw new BadRequest(
                `Need to wait for at least ${2 - room.playersNumber} more player(s)`
            );
        }

        await roomDto.updateById(roomId, { $set: { status: Status.GAME } });

        return;
    },
};

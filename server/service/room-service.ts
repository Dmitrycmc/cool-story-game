import { roomDto } from "../dto/room";
import { Status } from "../types/status";
import { playerDto } from "../dto/player";
import { IllegalArgument } from "../types/errors/Illegal-argument";

import { generate } from "rand-token";
import { Room } from "../types/room";
import { Player } from "../types/player";

export const roomService = {
    createRoom: async (): Promise<Room> => {
        const token = generate(6);
        const roomId = await roomDto.insertOne({ status: Status.REGISTRATION, token });

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
            throw new IllegalArgument("Invalid room");
        }
        if (player) {
            throw new IllegalArgument(`${name} already registered`);
        }

        const createdPlayerId = await playerDto.insertOne({
            name,
            token: generate(6),
            roomId: roomId,
        });

        const createdPlayer = await playerDto.findById(createdPlayerId);

        if (createdPlayer === null) {
            throw new Error("Player was not created");
        }

        return createdPlayer;
    },
};

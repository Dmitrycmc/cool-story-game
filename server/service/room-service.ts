import { roomDto } from "../dto/room";
import { Status } from "../types/status";
import { playerDto } from "../dto/player";
import { BadRequest } from "../types/errors/bad-request";

import { generate } from "rand-token";
import { Room } from "../types/room";
import { Player } from "../types/player";
import { Forbidden } from "../types/errors/forbidden";
import { questionsSetDto } from "../dto/questions-set";

export const roomService = {
    createRoom: async (): Promise<Room> => {
        const token = generate(6);

        const questionsSet = await questionsSetDto.findById("61fe06825360573ef8d33a76");
        if (questionsSet === null) {
            throw new Error("Server error: questions set not fount");
        }

        const roomId = await roomDto.insertOne({
            status: Status.REGISTRATION,
            token,
            playersNumber: 0,
            playerIds: [],
            questionsNumber: questionsSet.questions.length,
            questionsSetId: questionsSet.id!,
        });

        const createdRoom = await roomDto.findById(roomId);

        if (createdRoom === null) {
            throw new Error("Server error: room was not created");
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

        await roomDto.updateById(roomId, {
            $inc: { playersNumber: 1 },
            $push: { playerIds: createdPlayerId },
        });

        const createdPlayer = await playerDto.findById(createdPlayerId);

        if (createdPlayer === null) {
            throw new Error("Server error: player was not created");
        }

        return createdPlayer;
    },

    start: async ({ roomId, token }: { roomId: string; token: string }): Promise<void> => {
        const room = await roomDto.findById(roomId);

        if (room === null) {
            throw new BadRequest("Invalid room: not found");
        }
        if (room.token !== token) {
            throw new Forbidden("Access denied: invalid token");
        }
        if (room.status !== Status.REGISTRATION) {
            throw new BadRequest("Invalid room: the game has already started");
        }
        if (room.playersNumber < 2) {
            throw new BadRequest(
                `Not allowed: need to wait for at least ${2 - room.playersNumber} more player(s)`
            );
        }

        await roomDto.updateById(roomId, { $set: { status: Status.GAME } });

        return;
    },

    getStatus: async ({
        roomId,
        playerId,
        token,
    }: {
        roomId: string;
        playerId: string;
        token: string;
    }): Promise<Partial<Room>> => {
        const room = await roomDto.findById(roomId);

        if (room === null) {
            throw new BadRequest("Invalid room: not found");
        }
        if (room.status === Status.REGISTRATION) {
            const { token, ...roomStatus } = room;
            return roomStatus;
        }
        if (!playerId || !token) {
            throw new Forbidden("Access denied: required playerId and token");
        }
        if (room.playerIds.includes(playerId)) {
            const player = await playerDto.findById(playerId);
            if (player?.token === token) {
                const { token, ...roomStatus } = room;
                return roomStatus;
            }
        }
        throw new Forbidden("Access denied: invalid playerId / token");
    },
};

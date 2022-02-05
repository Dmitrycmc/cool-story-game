import { roomDto } from "../dto/room";
import { Status } from "../types/status";
import { playerDto } from "../dto/player";
import { BadRequest } from "../types/errors/bad-request";

import { generate } from "rand-token";
import { Room } from "../types/room";
import { Player } from "../types/player";
import { Forbidden } from "../types/errors/forbidden";
import { questionsSetDto } from "../dto/questions-set";

export const createRoom = async (): Promise<Room> => {
    const token = generate(6);

    const questionsSet = await questionsSetDto.findById("61fe06825360573ef8d33a76");
    if (questionsSet === null) {
        throw new Error("Server error: questions set not fount");
    }

    const roomId = await roomDto.insertOne({
        status: Status.REGISTRATION,
        token,
        playerIds: [],
        questionsNumber: questionsSet.questions.length,
        questionsSetId: questionsSet.id!,
    });

    const createdRoom = await roomDto.findById(roomId);

    if (createdRoom === null) {
        throw new Error("Server error: room was not created");
    }

    return createdRoom;
};

export const register = async ({
    roomId,
    name,
}: {
    roomId: string;
    name?: string;
}): Promise<Player> => {
    const room = await roomDto.findById(roomId);
    const player = await playerDto.findOne({
        name,
        roomId: roomId,
    });

    if (room === null) {
        throw new BadRequest("Invalid room: not found");
    }
    if (room.status !== Status.REGISTRATION) {
        throw new BadRequest("Invalid room: bad status");
    }
    if (!name) {
        throw new BadRequest(`Invalid name: ${name}`);
    }
    if (player) {
        throw new BadRequest(`Invalid name: ${name} already registered`);
    }

    const createdPlayerId = await playerDto.insertOne({
        name: name!,
        token: generate(6),
        roomId: roomId,
        answerSet: [],
    });

    await roomDto.updateById(roomId, { $push: { playerIds: createdPlayerId } });

    const createdPlayer = await playerDto.findById(createdPlayerId);

    if (createdPlayer === null) {
        throw new Error("Server error: player was not created");
    }

    return createdPlayer;
};

export const getStatus = async ({
    roomId,
    playerId,
    token,
    roomToken,
}: {
    roomId: string;
    playerId?: string;
    token?: string;
    roomToken?: string;
}): Promise<Partial<Room>> => {
    const room = await roomDto.findById(roomId);

    if (room === null) {
        throw new BadRequest("Invalid room: not found");
    }
    if (room.status === Status.REGISTRATION) {
        const { token: _roomToken, ...roomStatus } = room;
        return roomStatus;
    }
    if (roomToken) {
        if (room.token !== roomToken) {
            throw new Forbidden("Access denied: Invalid room token");
        }
    } else {
        if (!playerId || !token) {
            throw new Forbidden("Access denied: required playerId and token");
        }
        if (!room.playerIds.includes(playerId)) {
            throw new Forbidden("Access denied: invalid playerId / token");
        }
        const player = await playerDto.findById(playerId);
        if (player?.token !== token) {
            throw new Forbidden("Access denied: invalid playerId / token");
        }
    }

    const { token: _roomToken, ...roomStatus } = room;
    return roomStatus;
};

export const start = async ({
    roomId,
    token,
}: {
    roomId: string;
    token?: string;
}): Promise<Partial<Room>> => {
    const room = await roomDto.findById(roomId);

    if (room === null) {
        throw new BadRequest("Invalid room: not found");
    }
    if (room.token !== token) {
        throw new Forbidden("Access denied: invalid token");
    }
    if (room.status !== Status.REGISTRATION) {
        throw new BadRequest("Invalid room: bad status");
    }
    if (room.playerIds.length < 2) {
        throw new BadRequest(
            `Not allowed: need to wait for at least ${2 - room.playerIds.length} more player(s)`
        );
    }

    await roomDto.updateById(roomId, {
        $set: {
            status: Status.GAME,
            turn: 0,
            currentPlayerNumber: 0,
            currentQuestionNumber: 0,
        },
    });

    return await getStatus({ roomId, roomToken: token });
};

export const giveAnswer = async ({
    roomId,
    playerId,
    token,
    answer,
}: {
    roomId: string;
    playerId?: string;
    token?: string;
    answer?: string;
}): Promise<Partial<Room>> => {
    const room = await roomDto.findById(roomId);

    if (room === null) {
        throw new BadRequest("Invalid room: not found");
    }
    if (room.status !== Status.GAME) {
        throw new BadRequest("Invalid room: bad status");
    }
    if (!playerId || !token) {
        throw new Forbidden("Access denied: required playerId and token");
    }
    if (!room.playerIds.includes(playerId)) {
        throw new Forbidden("Access denied: invalid playerId / token");
    }
    const player = await playerDto.findById(playerId);
    if (player?.token !== token) {
        throw new Forbidden("Access denied: invalid playerId / token");
    }
    if (!answer?.length) {
        throw new BadRequest("Invalid answer");
    }
    if (playerId !== room.playerIds[room.currentPlayerNumber!]) {
        throw new Forbidden("Access denied: Not your turn");
    }

    await playerDto.updateById(playerId, { $push: { answerSet: answer } });

    const nextTurn = room.turn! + 1;

    if (nextTurn === room.questionsNumber * room.playerIds.length) {
        await roomDto.updateById(roomId, {
            $set: {
                status: Status.FINISHED,
                currentPlayerNumber: 0,
            },
            $unset: {
                turn: 1,
                currentQuestionNumber: 1,
            },
        });
    } else {
        await roomDto.updateById(roomId, {
            $set: {
                turn: nextTurn,
                currentPlayerNumber: nextTurn % room.playerIds.length,
                currentQuestionNumber: Math.floor(nextTurn / room.playerIds.length),
            },
        });
    }

    const updatedRoom = (await roomDto.findById(roomId)) as Room;

    const { token: _roomToken, ...roomStatus } = updatedRoom;
    return roomStatus;
};

export const getStory = async ({
    roomId,
    playerId,
    token,
}: {
    roomId: string;
    playerId?: string;
    token?: string;
}): Promise<string> => {
    const room = await roomDto.findById(roomId);

    if (room === null) {
        throw new BadRequest("Invalid room: not found");
    }
    if (room.status !== Status.FINISHED) {
        throw new BadRequest("Invalid room: bad status");
    }
    if (!playerId || !token) {
        throw new Forbidden("Access denied: required playerId and token");
    }
    if (!room.playerIds.includes(playerId)) {
        throw new Forbidden("Access denied: invalid playerId / token");
    }
    const player = await playerDto.findById(playerId);
    if (player?.token !== token) {
        throw new Forbidden("Access denied: invalid playerId / token");
    }
    if (playerId !== room.playerIds[room.currentPlayerNumber!]) {
        throw new Forbidden("Access denied: Not your turn");
    }

    const result = "res";

    if (room.currentPlayerNumber === room.playerIds.length - 1) {
        await roomDto.updateById(roomId, {
            $set: {
                status: Status.ARCHIVED,
            },
            $unset: {
                currentPlayerNumber: 1,
                currentQuestionNumber: 1,
            },
        });
    } else {
        await roomDto.updateById(roomId, {
            $inc: {
                currentPlayerNumber: 1,
            },
        });
    }

    return result;
};

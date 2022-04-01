import { roomDao } from "../dao/room";
import { Status } from "../types/status";
import { playerDao } from "../dao/player";
import { BadRequest } from "../types/errors/bad-request";

import { generate } from "rand-token";
import { Room } from "../types/room";
import { Player } from "../types/player";
import { Forbidden } from "../types/errors/forbidden";
import { questionsSetDao } from "../dao/questions-set";

export const createRoom = async (): Promise<Room> => {
    const token = generate(6);

    const questionsSet = await questionsSetDao.findOneById("61fe06825360573ef8d33a76");
    if (questionsSet === null) {
        throw new Error("Server error: questions set not fount");
    }

    const roomId = await roomDao.insertOne({
        status: Status.REGISTRATION,
        token,
        players: [],
        questionsNumber: questionsSet.questions.length,
        questionsSetId: questionsSet.id!,
    });

    const createdRoom = await roomDao.findOneById(roomId);

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
    const room = await roomDao.findOneById(roomId);
    const player = await playerDao.findOne({
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

    const createdPlayerId = await playerDao.insertOne({
        name: name!,
        token: generate(6),
        roomId: roomId,
        answerSet: [],
    });

    await roomDao.updateById(roomId, { $push: { players: { id: createdPlayerId, name } } });

    const createdPlayer = await playerDao.findOneById(createdPlayerId);

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
    const room = await roomDao.findOneById(roomId);

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
        if (!room.players.some((p) => p.id === playerId)) {
            throw new Forbidden("Access denied: invalid playerId / token");
        }
        const player = await playerDao.findOneById(playerId);
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
    const room = await roomDao.findOneById(roomId);

    if (room === null) {
        throw new BadRequest("Invalid room: not found");
    }
    if (room.token !== token) {
        throw new Forbidden("Access denied: invalid token");
    }
    if (room.status !== Status.REGISTRATION) {
        throw new BadRequest("Invalid room: bad status");
    }
    if (room.players.length < 2) {
        throw new BadRequest(
            `Not allowed: need to wait for at least ${2 - room.players.length} more player(s)`
        );
    }

    await roomDao.updateById(roomId, {
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
    const room = await roomDao.findOneById(roomId);

    if (room === null) {
        throw new BadRequest("Invalid room: not found");
    }
    if (room.status !== Status.GAME) {
        throw new BadRequest("Invalid room: bad status");
    }
    if (!playerId || !token) {
        throw new Forbidden("Access denied: required playerId and token");
    }
    if (!room.players.some((p) => p.id === playerId)) {
        throw new Forbidden("Access denied: invalid playerId / token");
    }
    const player = await playerDao.findOneById(playerId);
    if (player?.token !== token) {
        throw new Forbidden("Access denied: invalid playerId / token");
    }
    if (!answer?.length) {
        throw new BadRequest("Invalid answer");
    }
    if (playerId !== room.players[room.currentPlayerNumber!].id) {
        throw new Forbidden("Access denied: Not your turn");
    }

    await playerDao.updateById(playerId, { $push: { answerSet: answer } });

    const nextTurn = room.turn! + 1;

    if (nextTurn === room.questionsNumber * room.players.length) {
        await roomDao.updateById(roomId, {
            $set: {
                status: Status.FINISHED,
                currentPlayerNumber: 0,
                turn: nextTurn,
            },
            $unset: {
                currentQuestionNumber: 1,
            },
        });
    } else {
        await roomDao.updateById(roomId, {
            $set: {
                turn: nextTurn,
                currentPlayerNumber: nextTurn % room.players.length,
                currentQuestionNumber: Math.floor(nextTurn / room.players.length),
            },
        });
    }

    const updatedRoom = (await roomDao.findOneById(roomId)) as Room;

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
}): Promise<string[]> => {
    const room = await roomDao.findOneById(roomId);

    if (room === null) {
        throw new BadRequest("Invalid room: not found");
    }
    if (room.status !== Status.FINISHED) {
        throw new BadRequest("Invalid room: bad status");
    }
    if (!playerId || !token) {
        throw new Forbidden("Access denied: required playerId and token");
    }
    if (!room.players.some((p) => p.id === playerId)) {
        throw new Forbidden("Access denied: invalid playerId / token");
    }
    const player = await playerDao.findOneById(playerId);
    if (player?.token !== token) {
        throw new Forbidden("Access denied: invalid playerId / token");
    }

    const playerIndex = room.players.findIndex((p) => p.id === playerId);
    if (playerIndex > room.currentPlayerNumber!) {
        throw new Forbidden("Access denied: Not your turn");
    }

    const players = await playerDao.findById(room.players.map((p) => p.id!));

    const result = [...new Array(room.questionsNumber)].map((_, idx) => {
        const i = playerIndex! + 1 + idx;
        return players[i % room.players.length]?.answerSet[idx];
    });

    return result;
};

export const publishStory = async ({
    roomId,
    playerId,
    token,
}: {
    roomId: string;
    playerId?: string;
    token?: string;
}): Promise<Room> => {
    const room = await roomDao.findOneById(roomId);

    if (room === null) {
        throw new BadRequest("Invalid room: not found");
    }
    if (room.status !== Status.FINISHED) {
        throw new BadRequest("Invalid room: bad status");
    }
    if (!playerId || !token) {
        throw new Forbidden("Access denied: required playerId and token");
    }
    if (!room.players.some((p) => p.id === playerId)) {
        throw new Forbidden("Access denied: invalid playerId / token");
    }
    const player = await playerDao.findOneById(playerId);
    if (player?.token !== token) {
        throw new Forbidden("Access denied: invalid playerId / token");
    }
    if (playerId !== room.players[room.currentPlayerNumber!].id) {
        throw new Forbidden("Access denied: Not your turn");
    }

    if (room.currentPlayerNumber === room.players.length - 1) {
        await roomDao.updateById(roomId, {
            $set: {
                status: Status.ARCHIVED,
            },
            $unset: {
                currentPlayerNumber: 1,
                currentQuestionNumber: 1,
            },
        });
    } else {
        await roomDao.updateById(roomId, {
            $inc: {
                currentPlayerNumber: 1,
            },
        });
    }

    return (await roomDao.findOneById(roomId)) as Room;
};

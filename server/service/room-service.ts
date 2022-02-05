import { roomDto } from "../dto/room";
import { Status } from "../types/status";
import { playerDto } from "../dto/player";
import { ObjectId } from "mongodb";
import { IllegalArgument } from "../types/errors/Illegal-argument";

export const roomService = {
    createRoom: (): Promise<string> => {
        return roomDto.insertOne({ status: Status.REGISTRATION });
    },

    register: async ({ roomId, name }: { roomId: string; name: string }): Promise<string> => {
        const room = await roomDto.findById(roomId);
        const player = await playerDto.findOne({
            name,
            roomId: new ObjectId(roomId),
        });

        if (room === null) {
            throw new IllegalArgument("Invalid room");
        }
        if (player) {
            throw new IllegalArgument(`${name} already registered`);
        }

        await playerDto.insertOne({ name, roomId: new ObjectId(roomId) });

        return "";
    },
};

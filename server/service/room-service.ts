import { roomDto } from "../dto/room";
import { Status } from "../types/status";

export const roomService = {
    createRoom: (): Promise<string> => {
        return roomDto.insertOne({ status: Status.REGISTRATION });
    },

    register: async ({
        roomId,
        name,
    }: {
        roomId: string;
        name: string;
    }): Promise<string> => {
        const room = await roomDto.findById(roomId);
        const player = await roomDto.findById(roomId);

        console.log(room, player);

        return "";
    },
};

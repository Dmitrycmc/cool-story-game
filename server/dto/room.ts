import { Provider } from "./provider";
import { Filter } from "mongodb";
import { Room } from "../types/room";

export class RoomDto extends Provider {
    constructor() {
        super("rooms");
    }

    find = (filter: Filter<Room> = {}): Promise<Room[]> =>
        this.do((collection) => collection.find(filter).toArray());

    insertOne = (room: Room): Promise<string> =>
        this.do((collection) => collection.insertOne(room).then(a => a.insertedId.toJSON()));
}

export const roomDto = new RoomDto();
import { Provider } from "./provider";
import { Filter } from "mongodb";
import { Room } from "../types/room";

export class RoomDto extends Provider {
    constructor() {
        super("room");
    }

    find = (filter: Filter<Room> = {}) =>
        this.do((collection) => collection.find(filter).toArray());

    insertOne = (room: Room) => {
        this.do((collection) => collection.insertOne(room));
    };
}

export const roomDto = new RoomDto();
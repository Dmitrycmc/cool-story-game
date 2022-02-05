import { Provider } from "./provider";
import { Filter } from "mongodb";
import { Room } from "../types/room";
import { Status } from "../types/status";

export class RoomsTestDto extends Provider {
    constructor() {
        super("rooms");
    }

    find = (filter: Filter<Room> = {}): Promise<Room[]> =>
        this.do((collection) => collection.find(filter).toArray());

    insertOne = (room: Room): Promise<string> =>
        this.do((collection) =>
            collection.insertOne(room).then((a) => a.insertedId.toJSON())
        );

    deleteAll = (): Promise<void> =>
        this.do((collection) => collection.deleteMany({}));
}

export const roomsTestDto = new RoomsTestDto();

describe("Mongo provider", function () {
    it("should return empty list", async function () {
        await roomsTestDto.deleteAll();
        expect(await roomsTestDto.find()).toEqual([]);
    });

    it("should insert one", async function () {
        await roomsTestDto.insertOne({ status: Status.REGISTRATION });
        const data = await roomsTestDto.find();
        expect(data.length).toEqual(1);
        expect(data[0].status).toEqual(Status.REGISTRATION);
    });
});

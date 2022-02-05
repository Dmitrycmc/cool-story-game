import { Provider } from "./provider";
import { Room } from "../types/room";
import { Status } from "../types/status";

class RoomsTestDto extends Provider<Room> {
    constructor() {
        super("rooms");
    }
}

export const roomsTestDto = new RoomsTestDto();

describe("Mongo provider", function () {
    it("should delete all", async function () {
        await roomsTestDto.deleteAll();
        expect(await roomsTestDto.find()).toEqual([]);
    });

    it("should insert one", async function () {
        await roomsTestDto.insertOne({ status: Status.REGISTRATION });
        const data = await roomsTestDto.find();
        expect(data.length).toEqual(1);
        expect(data[0].status).toEqual(Status.REGISTRATION);
    });

    it("should return by id", async function () {
        const id = await roomsTestDto.insertOne({
            status: Status.GAME,
        });
        const data = await roomsTestDto.findById(id);

        expect(data?.id).toEqual(id);
    });

    it("should return null", async function () {
        const data = await roomsTestDto.findById("61fdd6db868546f655783a21");

        expect(data).toEqual(null);
    });
});

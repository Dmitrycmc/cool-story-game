import { Provider } from "./provider";
import { Room } from "../types/room";
import { Status } from "../types/status";

export const roomsTestDao = new Provider<Partial<Room>>("test-rooms");

describe("Mongo provider", function () {
    it("should delete all", async function () {
        await roomsTestDao.deleteAll();
        expect(await roomsTestDao.find()).toEqual([]);
    });

    it("should insert one", async function () {
        await roomsTestDao.insertOne({ status: Status.REGISTRATION });
        const data = await roomsTestDao.find();
        expect(data.length).toEqual(1);
        expect(data[0].status).toEqual(Status.REGISTRATION);
    });

    it("should return by id", async function () {
        const id = await roomsTestDao.insertOne({
            status: Status.GAME,
        });
        const data = await roomsTestDao.findOneById(id);

        expect(data?.id).toEqual(id);
    });

    it("should return null", async function () {
        const data = await roomsTestDao.findOneById("61fdd6db868546f655783a21");

        expect(data).toEqual(null);
    });
});

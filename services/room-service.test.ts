import * as roomService from "./room-service";
import { Room } from "../types/room";
import { Player } from "../types/player";
import { questionsSetDto } from "../dto/questions-set";
import { BadRequest } from "../types/errors/bad-request";

interface Credentials {
    id?: string;
    token?: string;
}

const room: Credentials = {};
const player1: Credentials = {};
const player2: Credentials = {};

describe("roomService", function () {
    jest.setTimeout(20000);

    it("should create room", async function () {
        const roomData: Room = await roomService.createRoom();

        expect(roomData).toHaveProperty("token");
        expect(roomData).toHaveProperty("id");
        expect(roomData.status).toEqual("REGISTRATION");

        room.id = roomData.id;
        room.token = roomData.token;
    });

    it("should register both players", async function () {
        const firstPlayerData: Player = await roomService.register({
            roomId: room.id!,
            name: "Player1",
        });
        const secondPlayerData: Player = await roomService.register({
            roomId: room.id!,
            name: "Player2",
        });

        expect(firstPlayerData).toHaveProperty("token");
        expect(firstPlayerData).toHaveProperty("id");
        expect(secondPlayerData).toHaveProperty("token");
        expect(secondPlayerData).toHaveProperty("id");

        player1.id = firstPlayerData.id;
        player1.token = firstPlayerData.token;
        player2.id = secondPlayerData.id;
        player2.token = secondPlayerData.token;
    });
});

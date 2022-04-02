import { getRandomInt } from "./number";

describe("number", function () {
    it("getRandomInt", function () {
        const values = [];
        for (let i = 0; i < 20; i++) {
            values.push(getRandomInt(5));
        }

        expect(values.every((v) => v >= 0 && v < 5)).toBeTruthy();
        expect(values.some((v) => v === 0)).toBeTruthy();
        expect(values.some((v) => v === 4)).toBeTruthy();
    });
});

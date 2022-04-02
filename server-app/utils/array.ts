import { getRandomInt } from "./number";

export const getRandomElement = <T>(list: T[]): T => {
    return list[getRandomInt(list.length)];
};

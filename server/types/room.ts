import { Status } from "./status";

export interface Room {
    id?: string;
    status: Status;
    token?: string;
    playersNumber: number;
    playerIds: string[];
    questionsNumber: number;
    questionsSetId: string;
}

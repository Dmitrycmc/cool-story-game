import { Status } from "./status";

export interface Room {
    id?: string;
    status: Status;
    token?: string;
    playerIds: string[];
    currentPlayerNumber?: number;
    questionsNumber: number;
    questionsSetId: string;
    currentQuestionNumber?: number;
    turn?: number;
}

import { Status } from "./status";
import { Player } from "./player";

export interface Room {
    id?: string;
    status: Status;
    token?: string;
    players: Partial<Player>[];
    currentPlayerNumber?: number;
    questionsNumber: number;
    questionsSetId: string;
    currentQuestionNumber?: number;
    turn?: number;
}

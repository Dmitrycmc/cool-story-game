import { Status } from "./status";
import { ObjectId } from "mongodb";

export interface Room {
    _id?: ObjectId;
    status: Status;
}

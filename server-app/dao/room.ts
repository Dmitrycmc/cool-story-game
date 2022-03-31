import { Provider } from "./provider";
import { Room } from "../types/room";

export const roomDao = new Provider<Room>("rooms");

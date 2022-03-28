import { Provider } from "./provider";
import { Player } from "../types/player";

export const playerDao = new Provider<Player>("player");

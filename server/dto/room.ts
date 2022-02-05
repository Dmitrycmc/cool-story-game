import { Provider } from "./provider";
import { Status } from "../types/status";

export class RoomDto extends Provider {
    constructor() {
        super("rooms");
    }

    create = (): Promise<string> =>
        this.do((collection) =>
            collection
                .insertOne({ status: Status.REGISTRATION })
                .then((a) => a.insertedId.toJSON())
        );
}

export const roomDto = new RoomDto();

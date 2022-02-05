import { CustomError } from "./custom-error";

export class ServerError extends CustomError {
    constructor(message: string) {
        super(500, message);
    }
}

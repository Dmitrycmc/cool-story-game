import { CustomError } from "./custom-error";

export class Forbidden extends CustomError {
    constructor(message: string) {
        super(403, message);
    }
}

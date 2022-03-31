import { CustomError } from "./custom-error";

export class BadRequest extends CustomError {
    constructor(message: string) {
        super(400, message);
    }
}

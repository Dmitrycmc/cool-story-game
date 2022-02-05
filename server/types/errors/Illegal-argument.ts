import { CustomError } from "./custom-error";

export class IllegalArgument extends CustomError {
    constructor(message: string) {
        super(400, message);
    }
}

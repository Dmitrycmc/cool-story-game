export class CustomError {
    private message: string;
    private code: number;

    public getMessage(): string {
        return this.message;
    }

    public getCode(): number {
        return this.code;
    }

    constructor(code: number, message: string) {
        this.code = code;
        this.message = message;
    }
}

export class AppError extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
    }
}

export class ParseError extends AppError{}
export class InvalidInputError extends AppError{}
export class UnsupportedError extends AppError{}
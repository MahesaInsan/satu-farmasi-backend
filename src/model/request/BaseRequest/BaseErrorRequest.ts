export default class BaseErrorRequest{
    private _message: string;
    private _error: string;
    private _code: number;
    
    constructor(err: string, code: number, message: string) {
        this._message = message;
        this._error = err;
        this._code = code;
    }

    get message(): string {
        return this._message;
    }

    get error(): string {
        return this._error;
    }

    set error(value: string) {
        this._error = value;
    }

    get Code(): number {
        return this._code;
    }

    set Code(value: number) {
        this._code = value;
    }
    
}
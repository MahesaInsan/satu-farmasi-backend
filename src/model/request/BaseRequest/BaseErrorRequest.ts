export default class BaseErrorRequest{
    private _message: string;
    private _error: string;
    private _code: number;
    private _errors: Array<Object> | null;
    
    constructor(err: string, code: number, message: string, errors: Array<Object>) {
        this._message = message;
        this._error = err;
        this._code = code;
        this._errors = errors;
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

    get errors(): Array<Object> | null{
        return this._errors;
    }

    set errors(value: Array<Object>) {
        this._errors = value;
    }
    
}

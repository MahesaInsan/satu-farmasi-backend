export default class BaseSuccessRequest<T> {
    private _code: number;
    private _status: string;
    private _data: T;

    constructor(code: number, status: string, data: T) {
        this._code = code;
        this._status = status;
        this._data = data;
    }

    get code(): number {
        return this._code;
    }

    get status(): string {
        return this._status;
    }

    get data(): T {
        return this._data;
    }

    set data(value: T) {
        this._data = value;
    }

    set code(value: number) {
        this._code = value;
    }

    set status(value: string) {
        this._status = value;
    }
}
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseSuccessRequest {
    constructor(code, status, data) {
        this._code = code;
        this._status = status;
        this._data = data;
    }
    get code() {
        return this._code;
    }
    get status() {
        return this._status;
    }
    get data() {
        return this._data;
    }
    set data(value) {
        this._data = value;
    }
    set code(value) {
        this._code = value;
    }
    set status(value) {
        this._status = value;
    }
}
exports.default = BaseSuccessRequest;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseErrorRequest {
    constructor(err, code, message, errors) {
        this._message = message;
        this._error = err;
        this._code = code;
        this._errors = errors;
    }
    get message() {
        return this._message;
    }
    get error() {
        return this._error;
    }
    set error(value) {
        this._error = value;
    }
    get Code() {
        return this._code;
    }
    set Code(value) {
        this._code = value;
    }
    get errors() {
        return this._errors;
    }
    set errors(value) {
        this._errors = value;
    }
}
exports.default = BaseErrorRequest;

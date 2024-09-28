"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class LoginResponse {
    constructor(firstName, lastName, token, role) {
        this._firstName = firstName;
        this._lastName = lastName;
        this._token = token;
        this._role = role;
    }
    get firstName() {
        return this._firstName;
    }
    set firstName(value) {
        this._firstName = value;
    }
    get lastName() {
        return this._lastName;
    }
    set lastName(value) {
        this._lastName = value;
    }
    get token() {
        return this._token;
    }
    set token(value) {
        this._token = value;
    }
    get role() {
        return this._role;
    }
    set role(value) {
        this._role = value;
    }
}
exports.default = LoginResponse;

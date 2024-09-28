"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class LoginRequest {
    constructor(email, password, isRemember) {
        this._email = email;
        this._password = password;
        this._isRemember = isRemember;
    }
    get email() {
        return this._email;
    }
    set email(value) {
        this._email = value;
    }
    get password() {
        return this._password;
    }
    set password(value) {
        this._password = value;
    }
    get isRemember() {
        return this.isRemember;
    }
    set isRemember(value) {
        this._isRemember = value;
    }
}
exports.default = LoginRequest;

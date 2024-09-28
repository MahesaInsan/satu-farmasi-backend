"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AddPatientRequest {
    constructor(name, credentialNumber, phoneNum) {
        this._name = name;
        this._credentialNumber = credentialNumber;
        this._phoneNum = phoneNum;
    }
    get name() {
        return this._name;
    }
    set name(value) {
        this._name = value;
    }
    get credentialNumber() {
        return this._credentialNumber;
    }
    set credentialNumber(value) {
        this._credentialNumber = value;
    }
    get phoneNum() {
        return this._phoneNum;
    }
    set phoneNum(value) {
        this._phoneNum = value;
    }
}
exports.default = AddPatientRequest;

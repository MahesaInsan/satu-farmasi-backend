"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AddVendorRequest {
    constructor(name, phoneNum, address, city) {
        this._name = name;
        this._phoneNum = phoneNum;
        this._address = address;
        this._city = city;
    }
    get name() {
        return this._name;
    }
    set name(value) {
        this._name = value;
    }
    get phoneNum() {
        return this._phoneNum;
    }
    set phoneNum(value) {
        this._phoneNum = value;
    }
    get address() {
        return this._address;
    }
    set address(value) {
        this._address = value;
    }
    get city() {
        return this._city;
    }
    set city(value) {
        this._city = value;
    }
}
exports.default = AddVendorRequest;

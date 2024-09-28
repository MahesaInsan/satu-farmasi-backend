"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EditVendorRequest {
    constructor(id, name, phoneNum, address, city, is_active) {
        this._id = id;
        this._name = name;
        this._phoneNum = phoneNum;
        this._address = address;
        this._city = city;
        this._is_active = is_active;
    }
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value;
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
    get is_active() {
        return this._is_active;
    }
    set is_active(v) {
        this._is_active = v;
    }
}
exports.default = EditVendorRequest;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseEditUserRequest {
    constructor(id, nik, email, password, firstName, lastName, dob, phoneNum, role, is_active, createdAt, updatedAt) {
        this._id = id;
        this._nik = nik;
        this._email = email;
        this._password = password;
        this._firstName = firstName;
        this._lastName = lastName;
        this._dob = dob;
        this._phoneNum = phoneNum;
        this._role = role;
        this._is_active = is_active;
        ;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
    }
    get id() {
        return this._id;
    }
    get nik() {
        return this._nik;
    }
    set nik(value) {
        this._nik = value;
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
    get dob() {
        return this._dob;
    }
    set dob(value) {
        this._dob = value;
    }
    get phoneNum() {
        return this._phoneNum;
    }
    set phoneNum(value) {
        this._phoneNum = value;
    }
    get role() {
        return this._role;
    }
    set role(value) {
        this.role = value;
    }
    get is_active() {
        return this._is_active;
    }
    set is_active(value) {
        this._is_active = value;
    }
    get createdAt() {
        return this._createdAt;
    }
    set createdAt(value) {
        this._createdAt = value;
    }
    get updatedAt() {
        return this._updatedAt;
    }
    set updatedAt(value) {
        this._updatedAt = value;
    }
}
exports.default = BaseEditUserRequest;

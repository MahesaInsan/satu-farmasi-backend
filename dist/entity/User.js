"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseEntity_1 = __importDefault(require("./BaseEntity"));
class User extends BaseEntity_1.default {
    constructor(id, is_active, created_at, updated_at, nik, email, password, firstName, lastName, dob, phoneNum, role) {
        super(id, is_active, created_at, updated_at);
        this.nik = nik;
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.dob = dob;
        this.phoneNum = phoneNum;
        this.role = role;
    }
}
exports.default = User;

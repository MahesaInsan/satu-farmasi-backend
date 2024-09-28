"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("./User"));
class Pharmacist extends User_1.default {
    constructor(id, is_active, created_at, updated_at, nik, email, password, firstName, lastName, dob, phoneNum, role) {
        super(id, is_active, created_at, updated_at, nik, email, password, firstName, lastName, dob, phoneNum, role);
    }
}
exports.default = Pharmacist;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseEditUserRequest_1 = __importDefault(require("./BaseRequest/BaseEditUserRequest"));
class EditAdminRequest extends BaseEditUserRequest_1.default {
    constructor(id, nik, email, password, firstName, lastName, dob, phoneNum, role, is_active, createdAt, updatedAt) {
        super(id, nik, email, password, firstName, lastName, dob, phoneNum, role, is_active, createdAt, updatedAt);
    }
}
exports.default = EditAdminRequest;

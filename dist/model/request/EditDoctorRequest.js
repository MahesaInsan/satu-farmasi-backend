"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseEditUserRequest_1 = __importDefault(require("./BaseRequest/BaseEditUserRequest"));
class EditDoctorRequest extends BaseEditUserRequest_1.default {
    // public specialist: string | null;
    constructor(id, nik, email, password, firstName, lastName, dob, phoneNum, role, is_active, createdAt, updatedAt) {
        super(id, nik, email, password, firstName, lastName, dob, phoneNum, role, is_active, createdAt, updatedAt);
        // this.specialist = specialist;
    }
}
exports.default = EditDoctorRequest;

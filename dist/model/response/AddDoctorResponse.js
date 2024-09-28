"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseAddUserResponse_1 = __importDefault(require("./BaseResponse/BaseAddUserResponse"));
class AddDoctorResponse extends BaseAddUserResponse_1.default {
    constructor(nik, email, firstName, lastName, dob, phoneNum, role, specialist) {
        super(nik, email, firstName, lastName, dob, phoneNum, role);
        this.specialist = specialist;
    }
    getSpecialist() {
        return this.specialist;
    }
    setSpecialist(value) {
        this.specialist = value;
    }
}
exports.default = AddDoctorResponse;

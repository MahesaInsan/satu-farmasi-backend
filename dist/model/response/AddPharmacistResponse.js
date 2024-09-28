"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseAddUserResponse_1 = __importDefault(require("./BaseResponse/BaseAddUserResponse"));
class AddPharmacistResponse extends BaseAddUserResponse_1.default {
    constructor(nik, email, firstName, lastName, dob, phoneNum, role) {
        super(nik, email, firstName, lastName, dob, phoneNum, role);
    }
}
exports.default = AddPharmacistResponse;

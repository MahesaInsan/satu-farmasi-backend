"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseAddUserRequest_1 = __importDefault(require("./BaseRequest/BaseAddUserRequest"));
class AddPharmacistRequest extends BaseAddUserRequest_1.default {
    constructor(nik, email, password, firstName, lastName, dob, phoneNum, role) {
        super(nik, email, password, firstName, lastName, dob, phoneNum, role);
    }
}
exports.default = AddPharmacistRequest;

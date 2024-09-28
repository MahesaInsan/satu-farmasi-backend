"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseSuccessRequest_1 = __importDefault(require("./BaseRequest/BaseSuccessRequest"));
class SuccessRequest extends BaseSuccessRequest_1.default {
    constructor(code, status, data) {
        super(code, status, data);
    }
}
exports.default = SuccessRequest;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseErrorRequest_1 = __importDefault(require("./BaseRequest/BaseErrorRequest"));
class BadRequest extends BaseErrorRequest_1.default {
    constructor(err, code, message, errors) {
        super(err, code, message, errors);
    }
}
exports.default = BadRequest;

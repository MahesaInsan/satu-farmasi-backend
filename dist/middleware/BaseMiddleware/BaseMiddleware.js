"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ResponseHelper_1 = __importDefault(require("../../controller/ResponseHelper/ResponseHelper"));
class BaseMiddleware {
    constructor() {
        this._responseHelper = new ResponseHelper_1.default();
    }
    get responseHelper() {
        return this._responseHelper;
    }
}
exports.default = BaseMiddleware;

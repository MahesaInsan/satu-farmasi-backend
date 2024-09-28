"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthMiddleware_1 = __importDefault(require("../middleware/AuthMiddleware"));
class BaseRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.authMiddleware = new AuthMiddleware_1.default();
    }
}
exports.default = BaseRouter;

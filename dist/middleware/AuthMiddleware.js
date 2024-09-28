"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const BaseMiddleware_1 = __importDefault(require("./BaseMiddleware/BaseMiddleware"));
class AuthMiddleware extends BaseMiddleware_1.default {
    constructor() {
        super();
    }
    authenticateToken(req, res, next) {
        let authHeader = req.headers["authorization"];
        let token = undefined;
        if (authHeader === undefined) {
            authHeader = req.cookies ? req.cookies["token"] : undefined;
            token = authHeader;
        }
        else {
            token = authHeader && authHeader.split(" ")[1];
        }
        if (!token) {
            console.log("Token is not found!");
            return res.status(403).send(this.responseHelper.constructUnAuthorizedRequest(new Error("Token is not found!")));
        }
        const secretToken = process.env["SECRET_TOKEN"];
        if (!secretToken)
            return this.responseHelper.constructInternalServerError(new Error("Secret token not found!"));
        try {
            const decoded = jsonwebtoken_1.default.verify(token, secretToken);
            req.user = decoded;
            next();
        }
        catch (err) {
            res.status(400).send('Invalid Token.');
        }
    }
    hasPermission(req, res, next, role) {
        var _a;
        console.log("req.user", req.user);
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== role)
            return res.status(403).send(this.responseHelper.constructUnAuthorizedRequest(new Error("Access Denied. Insufficient Permissions.")));
        next();
    }
}
exports.default = AuthMiddleware;

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ResponseHelper_1 = __importDefault(require("./ResponseHelper/ResponseHelper"));
const UserService_1 = __importDefault(require("../service/UserService"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class UserController {
    constructor() {
        this.userService = new UserService_1.default();
        this.responseHelper = new ResponseHelper_1.default();
    }
    getUserByEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const request = req.body;
                const user = yield this.userService.getUserByEmail(request.email);
                if (user && (yield this.userService.bcryptPassword(request.password, user.password))) {
                    try {
                        const token = this.userService.generateToken(user.email, user.role);
                        request.isRemember
                            ? res.cookie("token", token, this.responseHelper.constructCookieRequest(1000 * 60 * 60 * 24 * 30)) // 30 days
                            : res.cookie("token", token, this.responseHelper.constructCookieRequest(1000 * 60 * 60 * 24 * 7)); // 7 days 
                        return res.status(200).send(this.responseHelper.constructLoginResponse(user, token));
                    }
                    catch (error) {
                        return res.status(400).send(this.responseHelper.constructBadRequest(error));
                    }
                }
                throw new Error("Invalid username or password!");
            }
            catch (error) {
                res.status(400).send(this.responseHelper.constructBadRequest(error));
            }
        });
    }
    checkToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { token } = req.body;
            try {
                if (!token)
                    throw new Error("Token not found");
                const decoded = jsonwebtoken_1.default.verify(token, process.env["SECRET_TOKEN"]);
                console.log("decoded: ", decoded);
                // req.body.email = (decoded as any).email;
                return res.status(200).send({ message: "Token is valid" });
            }
            catch (error) {
                return res.status(401).send(this.responseHelper.constructUnAuthorizedRequest(error));
            }
        });
    }
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.cookie('token', '', { expires: new Date(0), httpOnly: true });
            res.status(200).send(this.responseHelper.constructDeleteUserResponse());
        });
    }
}
exports.default = UserController;

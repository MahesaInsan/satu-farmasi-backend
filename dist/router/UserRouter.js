"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseRouter_1 = __importDefault(require("./BaseRouter"));
const UserController_1 = __importDefault(require("../controller/UserController"));
class UserRouter extends BaseRouter_1.default {
    constructor() {
        super();
        this.userController = new UserController_1.default();
        this.initRoutes();
    }
    initRoutes() {
        this.router.post('/', this.userController.getUserByEmail.bind(this.userController));
        this.router.post('/check-token', this.userController.checkToken.bind(this.userController));
        this.router.delete('/', (req, res, next) => this.authMiddleware.authenticateToken(req, res, next), this.userController.deleteUser.bind(this.userController));
    }
}
exports.default = new UserRouter().router;

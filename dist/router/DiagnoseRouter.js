"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseRouter_1 = __importDefault(require("./BaseRouter"));
const DiagnoseController_1 = __importDefault(require("../controller/DiagnoseController"));
class DiagnoseRouter extends BaseRouter_1.default {
    constructor() {
        super();
        this.diagnoseController = new DiagnoseController_1.default();
        this.initRoutes();
    }
    initRoutes() {
        this.router.post('/', (req, res, next) => this.authMiddleware.authenticateToken(req, res, next), (req, res, next) => this.authMiddleware.hasPermission(req, res, next, "DOCTOR"), this.diagnoseController.diagnosePatient.bind(this.diagnoseController));
    }
}
exports.default = new DiagnoseRouter().router;

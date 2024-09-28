"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseRouter_1 = __importDefault(require("./BaseRouter"));
const AdminController_1 = __importDefault(require("../controller/AdminController"));
class AdminRouter extends BaseRouter_1.default {
    constructor() {
        super();
        this.adminController = new AdminController_1.default();
        this.initRoutes();
    }
    initRoutes() {
        this.router.post('/', this.adminController.addAdmin.bind(this.adminController));
        this.router.get('/', (req, res, next) => this.authMiddleware.authenticateToken(req, res, next), (req, res, next) => this.authMiddleware.hasPermission(req, res, next, "ADMIN"), this.adminController.getAllStaff.bind(this.adminController));
        this.router.get('/staffs', (req, res, next) => this.authMiddleware.authenticateToken(req, res, next), (req, res, next) => this.authMiddleware.hasPermission(req, res, next, "ADMIN"), this.adminController.getAllStaff.bind(this.adminController));
        this.router.get('/staff/:id', (req, res, next) => this.authMiddleware.authenticateToken(req, res, next), (req, res, next) => this.authMiddleware.hasPermission(req, res, next, "ADMIN"), this.adminController.getStaffById.bind(this.adminController));
        this.router.post('/staff/edit', (req, res, next) => this.authMiddleware.authenticateToken(req, res, next), (req, res, next) => this.authMiddleware.hasPermission(req, res, next, "ADMIN"), this.adminController.editStaff.bind(this.adminController));
        this.router.post('/staff/nik', (req, res, next) => this.authMiddleware.authenticateToken(req, res, next), (req, res, next) => this.authMiddleware.hasPermission(req, res, next, "ADMIN"), this.adminController.getStaffByNik.bind(this.adminController));
    }
}
exports.default = new AdminRouter().router;

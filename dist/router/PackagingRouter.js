"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PackagingController_1 = __importDefault(require("../controller/PackagingController"));
const BaseRouter_1 = __importDefault(require("./BaseRouter"));
class PackagingRouter extends BaseRouter_1.default {
    constructor() {
        super();
        this.packagingController = new PackagingController_1.default();
        this.initRoutes();
    }
    initRoutes() {
        this.router.use((req, res, next) => this.authMiddleware.authenticateToken(req, res, next), (req, res, next) => this.authMiddleware.hasPermission(req, res, next, "PHARMACIST"));
        this.router.post('/', this.packagingController.createPackaging.bind(this.packagingController));
        this.router.get('/', this.packagingController.getPackaging.bind(this.packagingController));
        this.router.get('/dropdown', this.packagingController.getPackagingsDropdown.bind(this.packagingController));
        this.router.post('/edit', this.packagingController.editPackaging.bind(this.packagingController));
        this.router.post('/delete', this.packagingController.deletePackaging.bind(this.packagingController));
    }
}
exports.default = new PackagingRouter().router;

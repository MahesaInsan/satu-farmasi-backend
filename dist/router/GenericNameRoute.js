"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GenericNameController_1 = __importDefault(require("../controller/GenericNameController"));
const BaseRouter_1 = __importDefault(require("./BaseRouter"));
class GenericNameRouter extends BaseRouter_1.default {
    constructor() {
        super();
        this.genericNameController = new GenericNameController_1.default();
        this.initRoutes();
    }
    initRoutes() {
        this.router.use((req, res, next) => this.authMiddleware.authenticateToken(req, res, next), (req, res, next) => this.authMiddleware.hasPermission(req, res, next, "PHARMACIST"));
        this.router.get("/", this.genericNameController.getAllGenericName.bind(this.genericNameController));
        this.router.get("/dropdown", this.genericNameController.getGenericNameDropdown.bind(this.genericNameController));
        this.router.get("/:id", this.genericNameController.getGenericNameById.bind(this.genericNameController));
        this.router.post("/", this.genericNameController.addGenericName.bind(this.genericNameController));
        this.router.put("/:id", this.genericNameController.editGenericName.bind(this.genericNameController));
        this.router.delete("/:id", this.genericNameController.deleteGenericName.bind(this.genericNameController));
    }
}
exports.default = new GenericNameRouter().router;

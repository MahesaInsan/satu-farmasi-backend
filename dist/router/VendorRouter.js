"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const VendorController_1 = __importDefault(require("../controller/VendorController"));
const BaseRouter_1 = __importDefault(require("./BaseRouter"));
class VendorRouter extends BaseRouter_1.default {
    constructor() {
        super();
        this.vendorController = new VendorController_1.default();
        this.initRoutes();
    }
    initRoutes() {
        this.router.use((req, res, next) => this.authMiddleware.authenticateToken(req, res, next), (req, res, next) => this.authMiddleware.hasPermission(req, res, next, "PHARMACIST"));
        this.router.get("/", this.vendorController.getAllVendor.bind(this.vendorController));
        this.router.get("/:id", this.vendorController.getVendorById.bind(this.vendorController));
        this.router.get("/:label", this.vendorController.getVendorByName.bind(this.vendorController));
        this.router.post("/", this.vendorController.addVendor.bind(this.vendorController));
        this.router.put("/:id", this.vendorController.editVendor.bind(this.vendorController));
        this.router.delete("/:id", this.vendorController.deleteVendor.bind(this.vendorController));
    }
}
exports.default = new VendorRouter().router;

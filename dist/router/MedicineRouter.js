"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseRouter_1 = __importDefault(require("./BaseRouter"));
const MedicineController_1 = __importDefault(require("../controller/MedicineController"));
class MedicineRouter extends BaseRouter_1.default {
    constructor() {
        super();
        this.medicineController = new MedicineController_1.default();
        this.initRoutes();
    }
    initRoutes() {
        // this.router.use(
        //     (req, res, next) => this.authMiddleware.authenticateToken(req as BaseRequest, res, next),
        //     (req, res, next) => this.authMiddleware.hasPermission(req as BaseRequest, res, next, "PHARMACIST"),
        // )
        this.router.get("/dropdownOptions", this.medicineController.getMedicineList.bind(this.medicineController));
        this.router.get("/", this.medicineController.getMedicines.bind(this.medicineController));
        this.router.post("/", this.medicineController.createMedicine.bind(this.medicineController));
        this.router.post("/edit", this.medicineController.editMedicine.bind(this.medicineController));
        this.router.post("/add-stock", this.medicineController.addStock.bind(this.medicineController));
        this.router.post("/check-stock", this.medicineController.checkStock.bind(this.medicineController));
        this.router.post("/delete", this.medicineController.deleteMedicine.bind(this.medicineController));
        this.router.post("/check-expiration", this.medicineController.checkExpiration.bind(this.medicineController));
    }
}
exports.default = new MedicineRouter().router;

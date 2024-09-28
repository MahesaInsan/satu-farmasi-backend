"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseRouter_1 = __importDefault(require("./BaseRouter"));
const PrescriptionController_1 = __importDefault(require("../controller/PrescriptionController"));
class PrescriptionRouter extends BaseRouter_1.default {
    constructor() {
        super();
        this.prescriptionController = new PrescriptionController_1.default();
        this.initRoutes();
    }
    initRoutes() {
        // this.router.use(
        //     (req, res, next) => this.authMiddleware.authenticateToken(req as BaseRequest, res, next),
        //     (req, res, next) => this.authMiddleware.hasPermission(req as BaseRequest, res, next, "PHARMACIST"),
        // )
        this.router.get('/', this.prescriptionController.getAllPrescription.bind(this.prescriptionController));
        this.router.post('/', this.prescriptionController.addNewPrescription.bind(this.prescriptionController));
        this.router.put('/', this.prescriptionController.editPrescription.bind(this.prescriptionController));
        this.router.get('/:id', this.prescriptionController.getPrescription.bind(this.prescriptionController));
    }
}
exports.default = new PrescriptionRouter().router;

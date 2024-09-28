"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DoctorController_1 = __importDefault(require("../controller/DoctorController"));
const DoctorValidation_1 = __importDefault(require("../validator/DoctorValidation"));
const BaseRouter_1 = __importDefault(require("./BaseRouter"));
class DoctorRouter extends BaseRouter_1.default {
    constructor() {
        super();
        this.doctorController = new DoctorController_1.default();
        this.doctorValidation = new DoctorValidation_1.default();
        this.initRoutes();
    }
    initRoutes() {
        this.router.post('/', this.doctorValidation.createDoctorValidation(), this.doctorController.addDoctor.bind(this.doctorController));
    }
}
exports.default = new DoctorRouter().router;

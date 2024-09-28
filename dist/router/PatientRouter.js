"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseRouter_1 = __importDefault(require("./BaseRouter"));
const PatientController_1 = __importDefault(require("../controller/PatientController"));
class PatientRouter extends BaseRouter_1.default {
    constructor() {
        super();
        this.patientController = new PatientController_1.default();
        this.initRoutes();
    }
    initRoutes() {
        this.router.get('/dropdownOptions', this.patientController.getPatientDropdownOptions.bind(this.patientController));
        // this.router.post('/', this.patientController.createNewPatient.bind(this.patientController))
    }
}
exports.default = new PatientRouter().router;

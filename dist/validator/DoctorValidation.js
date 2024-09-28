"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Doctor_1 = __importDefault(require("../entity/Doctor"));
const BaseValidation_1 = require("./BaseValidation");
class DoctorValidation extends BaseValidation_1.BaseValidation {
    createDoctorValidation() {
        const schema = Doctor_1.default.createSchema();
        return this.validateBodyData(schema);
    }
    // TODO: Add this validation to the router
    updateDoctorValidaiton() {
        const schema = Doctor_1.default.updateSchema();
        return this.validateBodyData(schema);
    }
    deleteValidation() {
        const schema = Doctor_1.default.deleteSchema();
        return this.validateBodyData(schema);
    }
}
exports.default = DoctorValidation;

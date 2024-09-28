"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AddPrescriptionRequest {
    constructor(patient, medicineList) {
        this._patient = patient;
        this._medicineList = medicineList;
    }
    get patient() {
        return this._patient;
    }
    set patient(value) {
        this._patient = value;
    }
    get medicineList() {
        return this._medicineList;
    }
    set medicineList(value) {
        this._medicineList = value;
    }
}
exports.default = AddPrescriptionRequest;

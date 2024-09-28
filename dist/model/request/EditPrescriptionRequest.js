"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EditPrescriptionRequest {
    constructor(prescriptionId, medicineList) {
        this._prescriptionId = prescriptionId;
        this._medicineList = medicineList;
    }
    get prescriptionId() {
        return this._prescriptionId;
    }
    set prescriptionId(value) {
        this._prescriptionId = value;
    }
    get medicineList() {
        return this._medicineList;
    }
    set medicineList(value) {
        this._medicineList = value;
    }
}
exports.default = EditPrescriptionRequest;

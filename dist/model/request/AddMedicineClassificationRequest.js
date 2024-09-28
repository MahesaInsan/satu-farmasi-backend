"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AddMedicineClassificationRequest {
    constructor(medicineId, classificationId) {
        this._medicineId = medicineId;
        this._classificationId = classificationId;
    }
    get medicineId() {
        return this._medicineId;
    }
    set medicineId(value) {
        this._medicineId = value;
    }
    get classificationId() {
        return this._classificationId;
    }
    set classificationId(value) {
        this._classificationId = value;
    }
}
exports.default = AddMedicineClassificationRequest;

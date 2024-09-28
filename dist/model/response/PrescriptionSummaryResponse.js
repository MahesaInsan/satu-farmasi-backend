"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PrescriptionSummaryResponse {
    constructor(prescriptionId, timestamps, patientName, status) {
        this._prescriptionId = prescriptionId;
        this._timestamps = timestamps;
        this._patientName = patientName;
        this._status = status;
    }
    get prescriptionId() {
        return this._prescriptionId;
    }
    set prescriptionId(value) {
        this._prescriptionId = value;
    }
    get timestamps() {
        return this._timestamps;
    }
    set timestamps(value) {
        this._timestamps = value;
    }
    get patientName() {
        return this._patientName;
    }
    set patientName(value) {
        this._patientName = value;
    }
    get status() {
        return this._status;
    }
    set status(value) {
        this._status = value;
    }
}
exports.default = PrescriptionSummaryResponse;

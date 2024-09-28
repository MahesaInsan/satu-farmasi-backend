"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PatientRequestDTO {
    constructor(patientId, patientName, credentialNum, phoneNum) {
        this._patientId = patientId;
        this._patientName = patientName;
        this._credentialNum = credentialNum;
        this._phoneNum = phoneNum;
    }
    get patientId() {
        return this._patientId;
    }
    set patientId(value) {
        this._patientId = value;
    }
    get patientName() {
        return this._patientName;
    }
    set patientName(value) {
        this._patientName = value;
    }
    get credentialNum() {
        return this._credentialNum;
    }
    set credentialNum(value) {
        this._credentialNum = value;
    }
    get phoneNum() {
        return this._phoneNum;
    }
    set phoneNum(value) {
        this._phoneNum = value;
    }
}
exports.default = PatientRequestDTO;

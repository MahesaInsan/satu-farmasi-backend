"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AddDiagnoseRequest {
    constructor(doctorId, title, description, prescription) {
        this._doctorId = doctorId;
        this._title = title;
        this._description = description;
        this._prescription = prescription;
    }
    get doctorId() {
        return this._doctorId;
    }
    set doctorId(value) {
        this._doctorId = value;
    }
    get title() {
        return this._title;
    }
    set title(value) {
        this._title = value;
    }
    get description() {
        return this._description;
    }
    set description(value) {
        this._description = value;
    }
    get prescription() {
        return this._prescription;
    }
    set prescription(value) {
        this._prescription = value;
    }
}
exports.default = AddDiagnoseRequest;

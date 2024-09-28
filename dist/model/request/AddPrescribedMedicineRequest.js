"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AddPrescribedMedicineRequest {
    constructor(medicineId, price, quantity, instruction) {
        this._medicineId = medicineId;
        this._price = price;
        this._quantity = quantity;
        this._instruction = instruction;
    }
    get medicineId() {
        return this._medicineId;
    }
    set medicineId(value) {
        this._medicineId = value;
    }
    get price() {
        return this._price;
    }
    set price(value) {
        this._price = value;
    }
    get quantity() {
        return this._quantity;
    }
    set quantity(value) {
        this._quantity = value;
    }
    get instruction() {
        return this._instruction;
    }
    set instruction(value) {
        this._instruction = value;
    }
}
exports.default = AddPrescribedMedicineRequest;

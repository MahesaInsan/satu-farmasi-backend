"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GetMedicineRequest {
    constructor(code, name, merk) {
        this._code = code;
        this._name = name;
        this._merk = merk;
    }
    get code() {
        return this._code;
    }
    get name() {
        return this._name;
    }
    get merk() {
        return this._merk;
    }
    set code(code) {
        this._code = code;
    }
    set name(name) {
        this._name = name;
    }
    set merk(merk) {
        this._merk = merk;
    }
}
exports.default = GetMedicineRequest;

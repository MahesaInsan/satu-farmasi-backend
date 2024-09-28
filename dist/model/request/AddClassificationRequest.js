"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AddClassificationRequest {
    constructor(label, value) {
        this._label = label;
        this._value = value;
    }
    get label() {
        return this._label;
    }
    set label(value) {
        this._label = value;
    }
    get value() {
        return this._value;
    }
    set value(value) {
        this._value = value;
    }
}
exports.default = AddClassificationRequest;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AddPackagingRequest {
    constructor(label, value) {
        this._label = label;
        this._value = value;
    }
    get label() {
        return this._label;
    }
    set label(v) {
        this._label = v;
    }
    get value() {
        return this._value;
    }
    set value(v) {
        this._value = v;
    }
}
exports.default = AddPackagingRequest;

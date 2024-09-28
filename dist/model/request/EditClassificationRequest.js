"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EditClassificationRequest {
    constructor(id, label, value, isActive) {
        this._id = id;
        this._label = label;
        this._value = value;
        this._isActive = isActive;
    }
    get id() {
        return this._id;
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
    get is_active() {
        return this._isActive;
    }
    set is_active(v) {
        this._isActive = v;
    }
}
exports.default = EditClassificationRequest;

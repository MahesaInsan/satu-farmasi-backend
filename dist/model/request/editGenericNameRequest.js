"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EditGenericNameRequest {
    constructor(id, label, value) {
        this._id = id;
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
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value;
    }
}
exports.default = EditGenericNameRequest;
